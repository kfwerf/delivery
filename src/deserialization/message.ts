import GrpCurlResponse from '../models/grpcurlresponse';
import { matchSafe } from '../utils/string';
import {getTypeNames} from "../utils/extract";
import {dedupe} from "../utils/list";

export const getLines = (response: GrpCurlResponse): string[] => {
  const data = response.getData();
  const lines = data
    .substring(data.indexOf('{\n'), data.lastIndexOf('}\n'))
    .split(/\n/gi)
    .map((line) => line.trim())
    .slice(1, -1);
  return lines;
};

export const getMessagePathFromRequest = (request: string): string => matchSafe(request, /describe [\w.]+/gm).join('').slice(9);

export const getMessagePath = (response: GrpCurlResponse): string => matchSafe(response.getData(), /.+ is a message:/gm).join('').replace(/ is a message:/, '');

export const getDependencies = (response: GrpCurlResponse): string[]=> {
  return getLines(response)
      .map(line => getTypeNames(line))
      .reduce((a, b) => a.concat(b) ,[])
      .filter(dedupe)
}

export const getMessageProperties = (response: GrpCurlResponse): { type: string; key: string }[] => matchSafe(response.getData(), /[a-zA-Z0-9._]+ [a-zA-Z0-9._]+ = [0-9]/gi).map((prop) => {
  const [type, key] = prop.split(' ');
  return { type, key };
});

export const getMessagePropertyLine = (line: string): { key: string; type: string; ordinal: number } => {
  const [type, key, ordinal] = line.split(/([a-zA-Z0-9._<>, ]+) ([a-zA-Z0-9._]+) = ([0-9])/gi).slice(1, -1);
  return { type, key, ordinal: Number(ordinal) };
}

export const getMessagePropertyLinesFiltered = (lines: string[], objectIndexes: { end: number; begin: number }[], onlyObjects: boolean = false) => {
  const isObjectRange = (idx: number): boolean => objectIndexes.filter(range => idx >= range.begin && idx <= range.end).length > 0;
  return lines.filter((line, idx) => {
    return onlyObjects ? isObjectRange(idx) : !isObjectRange(idx);
  });
}

export const getMessagePropertyObjectIndexes = (lines: string[]): { end: number; begin: number }[] => {
  const leftBraces = lines.map((line, idx) => line.indexOf('{') != -1 ? idx : -1).filter(idx => idx >= 0);
  const rightBraces = lines.map((line, idx) => line.indexOf('}') != -1 ? idx : -1).filter(idx => idx >= 0);
  if (leftBraces.length === rightBraces.length) {
    return leftBraces.map((leftLoc, idx) => ({ begin: leftLoc, end: rightBraces[idx]}));
  }
  throw new Error(`braces somehow did not align ${lines}`);
}

export const getOneOfValue = (line: string): string => {
  return line.split(/(oneof )(.+)( {)/gm).slice(2, -2)[0];
}