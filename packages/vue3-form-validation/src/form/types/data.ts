import { UnwrapRef } from 'vue'
import { FieldRule } from './rules'
import * as n_domain from '../../domain'

export type Field<TValue> = {
  $value: n_domain.DeepMaybeRef<TValue>
  $rules?: FieldRule<TValue>[]
}

export type TransformedField<T> = {
  $uid: number
  $value: T
  $errors: string[]
  $hasError: boolean
  $validating: boolean
  $setTouched(forceValidation?: boolean): Promise<void>
}

export type ResultFormData<FormData extends object> = FormData extends any
  ? {
      [K in keyof FormData]: FormData[K] extends
        | { $value: infer TValue }
        | undefined
        ? UnwrapRef<TValue>
        : FormData[K] extends object
        ? ResultFormData<FormData[K]>
        : FormData[K]
    }
  : never

export type FieldNames<T> = T extends (infer TArray)[]
  ? FieldNames<TArray>
  : {
      [K in keyof T]-?: T[K] extends { $value: any } | undefined
        ? K
        : FieldNames<T[K]>
    }[keyof T]

export type TransformedFormData<FormData extends object> = FormData extends any
  ? {
      [K in keyof FormData]: FormData[K] extends
        | { $value: infer TValue }
        | undefined
        ? FormData[K] extends undefined
          ? undefined
          : TransformedField<UnwrapRef<TValue>>
        : FormData[K] extends object
        ? TransformedFormData<FormData[K]>
        : FormData[K]
    }
  : never
