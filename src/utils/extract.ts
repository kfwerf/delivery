import GrpcService from '../models/GrpcService';
import { dedupe } from './list';

export const getRequestsFromServices = (servicesList: GrpcService[]): string[] =>
  servicesList
    .map((service) =>
      service
        .getRpcList()
        .map((rpc) => [rpc.getRequest()])
        .reduce((prev, next) => prev.concat(next), []),
    )
    .reduce((prev, next) => prev.concat(next), [])
    .filter(dedupe);

export const getTypeNames = (input: string): string[] =>
  input
    .split(/(\.[.a-zA-Z0-9_]+)/gm)
    .map((line) => line.trim())
    .filter((line) => line.match(/(\.[.a-zA-Z0-9_]+)/gm));
