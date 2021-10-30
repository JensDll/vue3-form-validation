import { Ref } from 'vue'

export type Key = string | number

export type DeepIndex<T, Ks extends readonly Key[], R = unknown> = Ks extends [
  infer First,
  ...infer Rest
]
  ? First extends keyof T
    ? Rest extends readonly Key[]
      ? DeepIndex<T[First], Rest>
      : R
    : R
  : T

export type MaybeRef<T> = Ref<T> | T

type _Tuple<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _Tuple<T, N, [T, ...R]>
export type Tuple<T, N extends number> = number extends N
  ? T[]
  : _Tuple<T, N, []>

export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> &
  Omit<T, K> &
  (T extends (...args: any[]) => any
    ? { (...args: Parameters<T>): ReturnType<T> }
    : unknown)
