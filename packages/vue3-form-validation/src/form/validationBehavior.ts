export type DefaultValidationBehaviorString =
  | 'aggresive'
  | 'lazy'
  | 'lazier'
  | 'submit'

export type ValidationBehaviorString =
  | DefaultValidationBehaviorString
  | keyof UseValidation_CustomValidationBehavior

export type ValidationBehaviorInfo = {
  hasError: boolean
  touched: boolean
  dirty: boolean
  force: boolean
  submit: boolean
}

export type ValidationBehaviorFunction = (
  info: ValidationBehaviorInfo
) => boolean | void

export type ValidationBehavior =
  | ValidationBehaviorString
  | ValidationBehaviorFunction
