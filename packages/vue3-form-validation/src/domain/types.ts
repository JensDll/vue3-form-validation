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

type IterableCollectionTypes = Map<any, any> | Set<any>

type WeakCollectionTypes = WeakMap<any, any> | WeakSet<any>

type CollectionTypes = WeakCollectionTypes | IterableCollectionTypes

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

export type MaybeRef<T> = T extends Ref<infer V> ? T | V : Ref<T> | T

type DeepMaybeRefCollectionTypes<T extends CollectionTypes> = T extends Map<
  infer TMapKey,
  infer TMap
>
  ? Map<TMapKey, DeepMaybeRefSimple<TMap, true>>
  : T extends WeakMap<infer TWeakMapKey, infer TWeakMap>
  ? WeakMap<TWeakMapKey, DeepMaybeRefSimple<TWeakMap, true>>
  : T extends Set<infer TSet>
  ? Set<DeepMaybeRefSimple<TSet, true>>
  : T extends WeakSet<infer TWeakSet>
  ? WeakSet<DeepMaybeRefSimple<TWeakSet, true>>
  : never

type DeepMaybeRefSimple<T, CheckForObject = false> = true extends CheckForObject
  ? T extends Record<string, unknown>
    ? DeepMaybeRefSimple<T>
    : T
  : T extends Ref
  ? MaybeRef<UnwrapRef<T>>
  : T extends CollectionTypes
  ? MaybeRef<DeepMaybeRefCollectionTypes<T>>
  : T extends ReadonlyArray<any>
  ? MaybeRef<{
      [K in keyof T]: DeepMaybeRefSimple<T[K], true>
    }>
  : T extends Record<string, unknown>
  ? MaybeRef<{
      [K in keyof T]: DeepMaybeRefSimple<T[K]>
    }>
  : MaybeRef<T>

export type DeepMaybeRef<T> = DeepMaybeRefSimple<T>
