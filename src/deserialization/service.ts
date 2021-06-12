import GrpCurlResponse from '../models/GrpCurlResponse';
import { matchSafe } from '../utils/string';

export const toServiceList = (response: GrpCurlResponse): string[] => {
  const parsed = response.getData()
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length);
  return parsed;
};

export const getServicePath = (response: GrpCurlResponse): string => matchSafe(response.getData(), /.+ is a service:/gm).join('').replace(/ is a service:/, '').trim();

export const getName = (path: string): string => path.split('.').slice(-1).join('');
