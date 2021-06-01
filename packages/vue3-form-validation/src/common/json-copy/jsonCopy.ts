export function jsonCopy(value: any) {
  if (typeof value === 'object') {
    return JSON.parse(JSON.stringify(value));
  }
  return value;
}
