import { Ref, UnwrapRef } from 'vue'

export type Key = string | number
export type KeyArray = readonly Key[]

export type DeepIndex<T, Ks extends KeyArray, R = unknown> = Ks extends [
  infer First,
  ...infer Rest
]
  ? First extends keyof T
    ? Rest extends KeyArray
      ? DeepIndex<T[First], Rest>
      : R
    : R
  : T

export type MaybeRef<T> = Ref<T> | Ref

type DeepMaybeRefObject<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Ref
    ? T[K] | UnwrapRef<T[K]>
    : T[K] extends any[]
    ? Ref<T[K]> | T[K]
    : T[K] extends Record<string, unknown>
    ? DeepMaybeRefObject<T[K]>
    : Ref<T[K]> | T[K]
}

export type DeepMaybeRef<T> = T extends Ref
  ? T | UnwrapRef<T>
  : T extends Record<string, unknown>
  ? DeepMaybeRefObject<T>
  : Ref<T> | T
