import { KeyedRule, SimpleRule } from 'vue3-form-validation'

import { Lengthy } from './types'

const randomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const rules = {
  required:
    (msg: string): SimpleRule =>
    x =>
      !x && msg,
  min:
    (min: number) =>
    (msg: string): SimpleRule<Lengthy> =>
    x =>
      x.length >= min || msg,
  max:
    (max: number) =>
    (msg: string): SimpleRule<Lengthy> =>
    x =>
      x.length <= max || msg,
  minMax:
    (min: number, max: number) =>
    (msg: string): SimpleRule<Lengthy> =>
    x =>
      (min <= x.length && x.length <= max) || msg,
  email:
    (msg: string): SimpleRule<string> =>
    x =>
      /\S+@\S+\.\S+/.test(x) || msg,
  equal:
    (msg: string): KeyedRule =>
    (...xs) =>
      xs.every(x => x === xs[0]) || msg,
  random:
    (min = 200, max = 2000): SimpleRule =>
    x =>
      new Promise<void | string>(resolve => {
        const ms = randomInt(min, max)
        setTimeout(() => {
          if (!x) {
            resolve(`Promise ${ms} ms`)
          } else {
            resolve()
          }
        }, ms)
      }),
  inTheFuture:
    (msg: string): SimpleRule<string> =>
    date => {
      const now = new Date()
      const start = new Date(date)

      if (
        start.getDate() < now.getDate() ||
        start.getMonth() < now.getMonth() ||
        start.getFullYear() < now.getFullYear()
      ) {
        return msg
      }
    }
}
