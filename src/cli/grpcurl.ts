// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cmd from 'node-cmd'; // untyped
import GrpCurlResponse from '../models/GrpCurlResponse';
import GrpCurlCommand, { bodyParams, emptyParams, defaultCommand } from '../models/GrpCurlCommand';

class Grpcurl {
  private response: Promise<GrpCurlResponse>;

  private command: GrpCurlCommand;

  private constructor(grpcurlCommand: GrpCurlCommand) {
    this.command = grpcurlCommand;
    this.response = this.send(grpcurlCommand.toString());
  }

  private send(command: string): Promise<GrpCurlResponse> {
    return new Promise((resolve) => {
      try {
        cmd.get(command, (err: string, data: string, sterr: string) => {
          const error = sterr || err;
          console.log(`${command}`, { error, data });
          resolve(new GrpCurlResponse(command, error, data));
        });
      } catch (err) {
        console.log(`Fatal on: ${command}`, err);
        resolve(new GrpCurlResponse(command, err as string));
      }
    });
  }

  public static from(grpcurlCommand: GrpCurlCommand): Grpcurl {
    return new Grpcurl(grpcurlCommand);
  }

  public getResponse(): Promise<GrpCurlResponse> {
    return this.response;
  }

  public getCommand(): GrpCurlCommand {
    return this.command;
  }
}

const grpcurl = {
  send: (body: string, url: string, method: string, command: GrpCurlCommand = defaultCommand): Grpcurl => {
    const hasBody = body && body.length > 3;
    if (hasBody) {
      return Grpcurl.from(command.setParams(bodyParams(body, url, method)));
    }
    return Grpcurl.from(command.setParams(emptyParams(url, method)));
  },
  list: (url: string, command: GrpCurlCommand = defaultCommand): Grpcurl =>
    Grpcurl.from(command.setParams(`${url} list`)),
  describe: (url: string, method: string, command: GrpCurlCommand = defaultCommand): Grpcurl =>
    Grpcurl.from(command.setParams(`${url} describe ${method}`)),
  // Use this
  command: (command: GrpCurlCommand = defaultCommand): Grpcurl => Grpcurl.from(command),
};

export default grpcurl;
