export type DefaultValidationBehaviorString =
  | 'aggresive'
  | 'lazy'
  | 'lazier'
  | 'submit'

export type ValidationBehaviorString =
  | DefaultValidationBehaviorString
  | keyof UseValidation_CustomValidationBehavior

export type ValidationBehaviorInfo<T = any> = {
  /**
   *
   * `True` while this rule has an error.
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
   * The `$value` property of the field this rule belongs to.
   */
  value: T
}

export type ValidationBehaviorFunction = (
  info: ValidationBehaviorInfo
) => boolean | void

export type ValidationBehavior =
  | ValidationBehaviorString
  | ValidationBehaviorFunction
