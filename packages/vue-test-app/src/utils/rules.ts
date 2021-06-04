const randomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const promise = (ms: number) => (x: any) =>
  new Promise<void | string>(resolve => {
    setTimeout(() => {
      if (!x) {
        resolve(`Promise ${ms} ms`);
      } else {
        resolve();
      }
    }, ms);
  });

export const randomPromise = (x: any) => {
  const ms = randomInt(300, 2000);

  return new Promise<void | string>(resolve => {
    setTimeout(() => {
      if (!x) {
        resolve(`Promise ${ms} ms`);
      } else {
        resolve();
      }
    }, ms);
  });
};

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
