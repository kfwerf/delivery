import GrpCurlResponse from '../models/GrpCurlResponse';
import { matchSafe } from '../utils/string';

export const getRpcList = (response: GrpCurlResponse): RegExpMatchArray => matchSafe(response.getData(), /rpc .+/gm);

export const getRpcMessage = (rpc: string): string[] => matchSafe(rpc, /\(([^\)]+)\)/gm).map((args) => args.match(/[.][_.a-zA-Z0-9]+/g).join(''));

export const getRpcName = (rpc: string): string => matchSafe(rpc, /rpc [a-zA-Z0-9]+/).join('').replace(/rpc /gm, '');
