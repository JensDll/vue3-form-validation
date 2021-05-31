export class PromiseCancel<T = unknown> {
  private promise!: Promise<T>;
  private resolve!: (value: T | PromiseLike<T>) => void;
  private reject!: (reason?: any) => void;
  private raceHasBeenCalled = false;

  constructor() {
    this.assign();
  }

  cancelResolve(value: T | PromiseLike<T>) {
    if (this.raceHasBeenCalled) {
      this.resolve(value);
      this.assign();
    }
  }

  cancelReject(reason?: any) {
    if (this.raceHasBeenCalled) {
      this.reject(reason);
      this.assign();
    }
  }

  race<TRace extends readonly Promise<any>[]>(...promises: [...TRace]) {
    this.raceHasBeenCalled = true;
    return Promise.race([this.promise, ...promises]);
  }

  private assign() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
