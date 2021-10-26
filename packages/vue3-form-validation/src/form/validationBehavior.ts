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
   * `True` if the paired rule of this behavior has an error.
   */
  hasError: boolean
  /**
   *
   * The touched state of the field.
   */
  touched: boolean
  /**
   *
   * The dirty state of the field.
   */
  dirty: boolean
  /**
   *
   * `True` if the validation was triggered with the `force` flag.
   */
  force: boolean
  /**
   *
   * `True` if the validation was triggered with the `submit` flag.
   */
  submit: boolean
  /**
   *
   * The `$value` of the field.
   */
  value: T
}

export type ValidationBehaviorFunction = (info: ValidationBehaviorInfo) => any

export type ValidationBehavior =
  | ValidationBehaviorString
  | ValidationBehaviorFunction
