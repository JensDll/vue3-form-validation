import { Lengthy } from './types'
import { KeyedRule, SimpleRule } from 'vue3-form-validation'

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
    (min = 100, max = 1500): SimpleRule =>
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
      })
}
