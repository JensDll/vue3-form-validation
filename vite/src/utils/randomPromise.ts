const randomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
