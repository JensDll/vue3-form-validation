import { SimpleRule, RuleWithKey } from './rules'

export type ValidationBehaviorString = string

export type ValidationBehaviorInfo = {
  form: {
    submitCount: number
  }
  field: {
    errorMessages: string[]
    touched: boolean
  }
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
