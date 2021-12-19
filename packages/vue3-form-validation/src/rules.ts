import { UnwrapRef } from 'vue-demi'

import {
  ValidationBehavior,
  ValidationBehaviorFunction
} from './validationBehavior'

export const isSimpleRule = (
  rule: SimpleRule | RuleWithKey
): rule is SimpleRule => typeof rule === 'function'

export const unpackRule = (
  rule: SimpleRule | RuleWithKey
): SimpleRule | undefined => (isSimpleRule(rule) ? rule : rule.rule)

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
      validationBehavior: ValidationBehavior,
      rule: SimpleRule<TParameter>,
      debounce?: number
    ]
  | [rule: SimpleRule<TParameter>, debounce: number]

export type FieldRuleWithKey<TParameters extends readonly any[]> =
  | RuleWithKey<TParameters>
  | [
      validationBehavior: ValidationBehavior,
      rule: RuleWithKey<TParameters>,
      debounce?: number
    ]
  | [rule: RuleWithKey<TParameters>, debounce: number]

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

export type RuleInformation = {
  validationBehavior: ValidationBehaviorFunction
  rule: SimpleRule | RuleWithKey
  debounce?: number
}
