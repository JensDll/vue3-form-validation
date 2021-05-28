export const required = (msg: string) => (x: any) => !x && msg;
export const min = (min: number) => (msg: string) => (x: any) =>
  x.length >= min || msg;
export const max = (max: number) => (msg: string) => (x: any) =>
  x.length <= max || msg;
export const email = (msg: string) => (x: any) => /\S+@\S+\.\S+/.test(x) || msg;
export const equal =
  (msg: string) =>
  (...xs: any[]) =>
    xs.every(x => x === xs[0]) || msg;
