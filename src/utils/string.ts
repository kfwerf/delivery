export function matchSafe(string: string, regex: string | RegExp): RegExpMatchArray {
  return (string?.match && string?.match(regex)) || [];
}

export const fixType = (type: string): string => (type.startsWith('.') ? type.slice(1) : type);
