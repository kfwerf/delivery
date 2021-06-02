import GrpcService from './GrpcService';
import {getRpcMessage, getRpcName} from "../deserialization/rpc";
import {fixType} from "../utils/string";

export default class GrpcRpc {
    private rpc: string;

    private readonly service: GrpcService;

    private readonly name: string;

    private readonly path: string;

    private readonly request: string;

    private readonly response: string;

    constructor(rpc: string, service: GrpcService) {
      const [request, response] = getRpcMessage(rpc);
      this.rpc = rpc;
      this.service = service;
      this.name = getRpcName(rpc);
      this.path = `${service.getPath()}/${this.name}`;
      this.request = fixType(request);
      this.response = fixType(response);
    }

    public getRequest(): string {
      return this.request;
    }

    public getName(): string {
        return this.name;
    }

    public getPath(): string {
        return this.path;
    }
}
