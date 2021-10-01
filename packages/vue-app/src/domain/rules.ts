import { Lengthy } from './types'

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
