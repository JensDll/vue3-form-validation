const randomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomPromise = () => {
  const ms = randomInt(300, 2000);

  return new Promise<string>(resolve => {
    setTimeout(() => {
      resolve(`Promise ${ms} ms`);
    }, ms);
  });
};

export const sleep = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
