export class PromiseCancel<T> {
  private promise!: Promise<T>;
  private _resolve!: (value: T | PromiseLike<T>) => void;
  private _reject!: (reason?: any) => void;

  constructor() {
    this.assign();
  }

  cancelResolve(value: T | PromiseLike<T>) {
    this._resolve(value);
    this.assign();
  }

  cancelReject(reason?: any) {
    this._reject(reason);
    this.assign();
  }

  race<TRace extends Promise<any>[]>(...promises: readonly [...TRace]) {
    return Promise.race([this.promise, ...promises]);
  }

  private assign() {
    this.promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }
}
