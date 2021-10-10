import { Lengthy } from './types'

const randomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const rules = {
  required: (msg: string) => (x: any) => !x && msg,
  min: (min: number) => (msg: string) => (x: Lengthy) => x.length >= min || msg,
  max: (max: number) => (msg: string) => (x: Lengthy) => x.length <= max || msg,
  minMax: (min: number, max: number) => (msg: string) => (x: Lengthy) =>
    (min <= x.length && x.length <= max) || msg,
  email: (msg: string) => (x: string) => /\S+@\S+\.\S+/.test(x) || msg,
  equal:
    (msg: string) =>
    (...xs: any[]) =>
      xs.every(x => x === xs[0]) || msg,
  random:
    (min = 100, max = 1500) =>
    (x: unknown) =>
      new Promise<void | string>(resolve => {
        const ms = randomInt(min, max)
        setTimeout(() => {
          if (!x) {
            resolve(`Promise ${ms} ms`)
          } else {
            resolve()
          }
        }, ms)
      })
}
