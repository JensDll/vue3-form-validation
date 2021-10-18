import { UnwrapRef } from 'vue'
import { FieldValidationBehavior } from './validationBehavior'

export type SimpleRule<TParameter = any> = (...value: TParameter[]) => any
export type KeyedRule<TParameters extends readonly any[] = any[]> = (
  ...values: [...TParameters]
) => any
export type RuleWithKey<T extends readonly any[] = any[]> = {
  key: string
  rule?: KeyedRule<T>
}

export type FieldSimpleRule<TParameter = any> =
  | SimpleRule<TParameter>
  | [
      validationBehavior: FieldValidationBehavior,
      rule: SimpleRule<TParameter>,
      debounce?: number
    ]
export type FieldRuleWithKey<TParameters extends readonly any[]> =
  | RuleWithKey<TParameters>
  | [
      validationBehavior: FieldValidationBehavior,
      rule: RuleWithKey<TParameters>,
      debounce?: number
    ]

export type FieldRule<
  TSimpleParameter,
  TKeyedParameters extends readonly any[] = any[]
> =
  | FieldSimpleRule<
      TSimpleParameter extends any[]
        ? TSimpleParameter
        : UnwrapRef<TSimpleParameter>
    >
  | FieldRuleWithKey<TKeyedParameters>
