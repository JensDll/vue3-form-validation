export type DefaultValidationBehaviorString =
  | 'aggressive'
  | 'lazy'
  | 'lazier'
  | 'submit'

export type ValidationBehaviorString =
  | DefaultValidationBehaviorString
  | keyof UseValidation_CustomValidationBehaviorFunctions

export type ValidationBehaviorInfo<T = any> = {
  /**
   *
   * `True` if the rule of this validation behavior has an error.
   */
  hasError: boolean
  /**
   *
   * `True` if the field of this rule is touched.
   */
  touched: boolean
  /**
   *
   * `True` if the field of this rule is dirty.
   */
  dirty: boolean
  /**
   *
   * `True` if the rule was called with the `force` flag.
   */
  force: boolean
  /**
   *
   * `True` if the rule was called with the `submit` flag.
   */
  submit: boolean
  /**
   *
   * The field's `$value` property of this rule.
   */
  value: T
}

export type ValidationBehaviorFunction = (info: ValidationBehaviorInfo) => any

export type ValidationBehavior =
  | ValidationBehaviorString
  | ValidationBehaviorFunction
