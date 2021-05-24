export function jsonCopy(value: any) {
  if (value === undefined) {
    return value;
  }
  return JSON.parse(JSON.stringify(value));
}
