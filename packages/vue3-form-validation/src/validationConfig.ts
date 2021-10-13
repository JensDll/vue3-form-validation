import { ValidationBehavior, ValidationBehaviorString } from './form'

export class ValidationConfig {
  defaultValidationBehavior: ValidationBehaviorString
  validationBehavior: Map<ValidationBehaviorString, ValidationBehavior>

  constructor() {
    const aggresive: ValidationBehavior = () => true
    const lazy: ValidationBehavior = ({ touched }) => touched
    const lazier: ValidationBehavior = ({ force, touched, hasError }) =>
      force || (touched && hasError)

    this.defaultValidationBehavior = 'lazier'
    this.validationBehavior = new Map([
      ['aggresive', aggresive],
      ['lazy', lazy],
      ['lazier', lazier]
    ])
  }

  getDefaultValidationBehavior() {
    return this.validationBehavior.get(this.defaultValidationBehavior)!
  }
}

export const VALIDATION_CONFIG = new ValidationConfig()
