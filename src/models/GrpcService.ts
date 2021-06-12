import GrpCurlResponse from './GrpCurlResponse';
import GrpcRpc from './GrpcRpc';
import {getName, getServicePath} from '../deserialization/service';
import { getRpcList } from '../deserialization/rpc';

export default class GrpcService {
  private readonly response: GrpCurlResponse;

  private readonly servicePath: string;

  private readonly serviceName: string;

  private readonly rpcRegExpList: RegExpMatchArray;

  private readonly rpcList: GrpcRpc[];

  constructor(response: GrpCurlResponse) {
    this.response = response;
    this.servicePath = getServicePath(response);
    this.serviceName = getName(this.servicePath);
    this.rpcRegExpList = getRpcList(response);
    this.rpcList = this.rpcRegExpList.map((rpc): GrpcRpc => new GrpcRpc(rpc, this));
  }

  public getPath(): string {
    return this.servicePath;
  }

  public getName(): string {
    return this.serviceName;
  }

  public getRpcList(): GrpcRpc[] {
    return this.rpcList;
  }
}
