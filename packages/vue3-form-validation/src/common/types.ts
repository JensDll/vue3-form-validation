import { Ref, UnwrapRef } from 'vue'

export type Key = string | number
export type Keys = readonly Key[]
export type DeepIndex<T, Ks extends Keys, R = unknown> = Ks extends [
  infer First,
  ...infer Rest
]
  ? First extends keyof T
    ? Rest extends Keys
      ? DeepIndex<T[First], Rest>
      : R
    : R
  : T

type RefUnrefObject<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Ref
    ? T[K] | UnwrapRef<T[K]>
    : T[K] extends any[]
    ? Ref<T[K]> | T[K]
    : T[K] extends Record<string, unknown>
    ? RefUnref<T[K]>
    : Ref<T[K]> | T[K]
}

export type RefUnref<T> = T extends Ref
  ? T | UnwrapRef<T>
  : T extends Record<string, unknown>
  ? RefUnrefObject<T>
  : Ref<T> | T
