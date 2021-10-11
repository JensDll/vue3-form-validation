import { SimpleRule, RuleWithKey } from './rules'

export type ValidationBehaviorString = string

export type ValidationBehaviorInfo = {
  submitCount: number
  errorMessages: string[]
  hasError: boolean
  touched: boolean
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
