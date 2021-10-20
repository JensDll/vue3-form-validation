import { UnwrapRef } from 'vue'
import {
  ValidationBehavior,
  ValidationBehaviorFunction
} from './validationBehavior'

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
  | [ValidationBehavior, SimpleRule<TParameter>, number?]
  | [SimpleRule<TParameter>, number]

export type FieldRuleWithKey<TParameters extends readonly any[]> =
  | RuleWithKey<TParameters>
  | [ValidationBehavior, RuleWithKey<TParameters>, number?]
  | [RuleWithKey<TParameters>, number]

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

export const isSimpleRule = (
  rule: SimpleRule | RuleWithKey
): rule is SimpleRule => typeof rule === 'function'
