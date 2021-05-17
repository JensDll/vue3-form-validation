import { Ref, UnwrapRef } from 'vue';

type RefUnrefObject<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Ref
    ? T[K] | UnwrapRef<T[K]>
    : T[K] extends any[]
    ? Ref<T[K]> | T[K]
    : T[K] extends Record<string, unknown>
    ? RefUnref<T[K]>
    : Ref<T[K]> | T[K];
};

export type RefUnref<T> = T extends Ref
  ? T | UnwrapRef<T>
  : T extends Record<string, unknown>
  ? RefUnrefObject<T>
  : Ref<T> | T;
