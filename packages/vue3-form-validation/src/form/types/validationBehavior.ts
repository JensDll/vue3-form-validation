import { SimpleRule, RuleWithKey } from './rules'

export type DefaultValidationBehaviorString = 'aggresive' | 'lazy' | 'lazier'

export type ValidationBehaviorString =
  | DefaultValidationBehaviorString
  | CustomValidationBehavior

export type ValidationBehaviorInfo = {
  submitCount: number
  hasError: boolean
  touched: boolean
  dirty: boolean
  force: boolean
  submit: boolean
}

export type ValidationBehavior = (
  info: ValidationBehaviorInfo
) => boolean | void

export type ValidationBehaviorRuleTupel = [
  ValidationBehavior,
  SimpleRule | RuleWithKey
]

export type FieldValidationBehavior =
  | ValidationBehaviorString
  | ValidationBehavior
