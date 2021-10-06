import { Ref, UnwrapRef } from 'vue'

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

type DeepMaybeRefObject<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Ref
    ? T[K] | UnwrapRef<T[K]>
    : T[K] extends any[]
    ? MaybeRef<T[K]>
    : T[K] extends Record<string, unknown>
    ? DeepMaybeRefObject<T[K]>
    : MaybeRef<T[K]>
}

export type DeepMaybeRef<T> = T extends Ref
  ? T | UnwrapRef<T>
  : T extends Record<string, unknown>
  ? DeepMaybeRefObject<T>
  : MaybeRef<T>
