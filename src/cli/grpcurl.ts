// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cmd from 'node-cmd'; // untyped
import { execPath } from '../binaries';
import GrpCurlResponse from '../models/grpcurlresponse';

function grpCurlExecutor(params = ''): Promise<GrpCurlResponse> {
  // FIXME: make this command editable
  const command = `${execPath} -plaintext -max-time 5 ${params}`;
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

const sendWithBody = (body: string, url: string, method: string) => grpCurlExecutor(`-d '${body}' ${url} ${method}`);
const sendEmpty = (url: string, method: string) => grpCurlExecutor(`${url} ${method}`);

const grpcurl = {
  help: (): Promise<GrpCurlResponse> => grpCurlExecutor('-help'),
  version: (): Promise<GrpCurlResponse> => grpCurlExecutor('-version'),
  send: (body: string, url: string, method: string): Promise<GrpCurlResponse> => {
    const hasBody = body && body.length > 3;
    return hasBody ? sendWithBody(body, url, method) : sendEmpty(url, method);
  },
  list: (url: string): Promise<GrpCurlResponse> => grpCurlExecutor(`${url} list`),
  describe: (url: string, method: string): Promise<GrpCurlResponse> => grpCurlExecutor(`${url} describe ${method}`),
};

export default grpcurl;
