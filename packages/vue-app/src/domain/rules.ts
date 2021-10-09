import { Lengthy } from './types'

const randomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const required = (msg: string) => (x: any) => !x && msg
export const min = (min: number) => (msg: string) => (x: Lengthy) =>
  x.length >= min || msg
export const max = (max: number) => (msg: string) => (x: Lengthy) =>
  x.length <= max || msg
export const minMax =
  (min: number, max: number) => (msg: string) => (x: Lengthy) =>
    (min <= x.length && x.length <= max) || msg
export const email = (msg: string) => (x: string) =>
  /\S+@\S+\.\S+/.test(x) || msg
export const equal =
  (msg: string) =>
  (...xs: any[]) =>
    xs.every(x => x === xs[0]) || msg
export const random =
  (min = 100, max = 1500) =>
  (x: unknown) =>
    new Promise(resolve => {
      const ms = randomInt(min, max)
      setTimeout(() => {
        if (!x) {
          resolve(`Promise ${ms} ms`)
        }
      }, ms)
    })
