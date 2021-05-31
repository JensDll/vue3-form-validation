export class PromiseCancel<T = unknown> {
  private promise!: Promise<T>;
  private resolve!: (value: T | PromiseLike<T>) => void;
  private reject!: (reason?: any) => void;

  constructor() {
    this.assign();
  }

  cancelResolve(value: T | PromiseLike<T>) {
    this.resolve(value);
    this.assign();
  }

  cancelReject(reason?: any) {
    this.reject(reason);
    this.assign();
  }

  race<TRace extends Promise<any>[]>(...promises: readonly [...TRace]) {
    return Promise.race([this.promise, ...promises]);
  }

  private assign() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
