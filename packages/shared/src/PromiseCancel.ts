export class CancelError extends Error {}

export class PromiseCancel<T = unknown> {
  private promise!: Promise<T>
  private resolve!: (value: T | PromiseLike<T>) => void
  private reject!: (reason?: any) => void

  isRacing = false

  constructor() {
    this.assign()
  }

  cancelResolve(value: T | PromiseLike<T>) {
    if (this.isRacing) {
      this.isRacing = false
      this.resolve(value)
      this.assign()
    }
  }

  cancelReject(reason?: any) {
    if (this.isRacing) {
      this.isRacing = false
      this.reject(reason)
      this.assign()
    }
  }

  race<Ps extends readonly Promise<any>[]>(...promises: [...Ps]) {
    this.isRacing = true
    return Promise.race([this.promise, ...promises])
  }

  private assign() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}
