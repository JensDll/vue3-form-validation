import { ValidationBehaviorFunction, ValidationBehaviorString } from './form'

export class ValidationConfig {
  defaultValidationBehavior: ValidationBehaviorString
  validationBehavior: Map<ValidationBehaviorString, ValidationBehaviorFunction>

  constructor() {
    const aggresive: ValidationBehaviorFunction = () => true
    const lazy: ValidationBehaviorFunction = ({ touched }) => touched
    const lazier: ValidationBehaviorFunction = ({
      force,
      touched,
      submit,
      hasError
    }) => force || submit || (touched && hasError)
    const submit: ValidationBehaviorFunction = ({ submit, hasError }) =>
      submit || hasError

    this.defaultValidationBehavior = 'lazier'
    this.validationBehavior = new Map([
      ['aggresive', aggresive],
      ['lazy', lazy],
      ['lazier', lazier],
      ['submit', submit]
    ])
  }

  getDefaultValidationBehavior() {
    return this.validationBehavior.get(this.defaultValidationBehavior)!
  }
}

export const VALIDATION_CONFIG = new ValidationConfig()
