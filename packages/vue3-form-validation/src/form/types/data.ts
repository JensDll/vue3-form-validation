import { UnwrapRef, Ref } from 'vue'
import { FieldRule } from './rules'
import * as n_domain from '../../domain'

type DeepMaybeRefRecord<T extends Record<n_domain.Key, unknown> | undefined> =
  T extends undefined
    ? undefined
    : {
        [K in keyof T]: T[K] extends Ref
          ? T[K] | UnwrapRef<T[K]>
          : T[K] extends any[]
          ? n_domain.MaybeRef<T[K]>
          : T[K] extends Record<string, unknown> | undefined
          ? DeepMaybeRefRecord<T[K]>
          : n_domain.MaybeRef<T[K]>
      }

export type DeepMaybeRef<T> = T extends Ref
  ? T | UnwrapRef<T>
  : T extends Record<string, unknown>
  ? DeepMaybeRefRecord<T>
  : n_domain.MaybeRef<T>

export type Field<
  TValue,
  TExtra extends Record<n_domain.Key, unknown> = Record<string, never>
> = {
  $value: DeepMaybeRef<TValue>
  $rules?: FieldRule<TValue>[]
} & (TExtra extends Record<string, never> ? unknown : TExtra)

export type TransformedField<
  TValue,
  TExtra extends Record<n_domain.Key, unknown> = Record<string, never>
> = {
  $uid: number
  $value: TValue
  $errors: string[]
  $rawErrors: (string | null)[]
  $hasError: boolean
  $validating: boolean
  $setTouched(touched?: boolean, forceValidate?: boolean): Promise<void>
} & (TExtra extends Record<string, never> ? unknown : UnwrapRef<TExtra>)

export type ResultFormData<FormData extends object | undefined> =
  FormData extends undefined
    ? undefined
    : {
        [K in keyof FormData]: FormData[K] extends
          | { $value: infer TValue }
          | undefined
          ? UnwrapRef<TValue>
          : FormData[K] extends object | undefined
          ? ResultFormData<FormData[K]>
          : FormData[K]
      }

export type FieldNames<T> = T extends (infer TArray)[]
  ? FieldNames<TArray>
  : {
      [K in keyof T]-?: T[K] extends { $value: any } | undefined
        ? K
        : FieldNames<T[K]>
    }[keyof T]

export type TransformedFormData<FormData extends object | undefined> =
  FormData extends undefined
    ? undefined
    : {
        [K in keyof FormData]: FormData[K] extends
          | { $value: infer TValue }
          | undefined
          ? FormData[K] extends undefined
            ? undefined
            : TransformedField<
                UnwrapRef<TValue>,
                Omit<Exclude<FormData[K], undefined>, '$value' | '$rules'>
              >
          : FormData[K] extends object | undefined
          ? TransformedFormData<FormData[K]>
          : FormData[K]
      }
