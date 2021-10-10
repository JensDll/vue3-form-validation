import { UnwrapRef } from 'vue'
import * as n_domain from '../domain'

// Rules
export type SimpleRule<TParameter = any> = (...values: TParameter[]) => any
export type KeyedRule<TParameters extends readonly any[] = any[]> = (
  ...values: [...TParameters]
) => any
export type RuleWithKey<T extends readonly any[] = any[]> = {
  key: string
  rule?: KeyedRule<T>
}

export type FieldSimpleRule<T = any> =
  | SimpleRule<T>
  | [ValidationBehavior, SimpleRule<T>]
export type FieldRuleWithKey<TParameters extends readonly any[]> =
  | RuleWithKey<TParameters>
  | [ValidationBehavior, RuleWithKey<TParameters>]

export type FieldRule<
  TSimpleParameter,
  TKeyedParameters extends readonly any[]
> =
  | FieldSimpleRule<UnwrapRef<TSimpleParameter>>
  | FieldRuleWithKey<TKeyedParameters>

// Validation behavior
export type ValidationBehaviorInfo = {
  submitCount: number
  errorMessages: string[]
}

export type ValidationBehaviorString = string

export type ValidationBehaviorFunction = (
  info: ValidationBehaviorInfo
) => boolean | void

export type ValidationBehaviorResult =
  | ReturnType<ValidationBehaviorFunction>
  | ValidationBehaviorString

export type ValidationBehavior =
  | ValidationBehaviorString
  | ValidationBehaviorFunction

// Fields
export type Field<TValue> = {
  $value: n_domain.DeepMaybeRef<TValue>
  $rules?: FieldRule<TValue, any[]>[]
  $validationBehavior?: ValidationBehavior
}

export type TransformedField<T> = {
  $uid: number
  $value: T
  $errors: string[]
  $hasError: boolean
  $validating: boolean
  $setTouched(forceValidation?: boolean): Promise<void>
}

// Form data
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
