import { ValidationBehaviorFunction, ValidationBehaviorString } from './form'

export class ValidationConfig {
  defaultValidationBehavior: ValidationBehaviorString
  validationBehavior: Map<ValidationBehaviorString, ValidationBehaviorFunction>

  constructor() {
    const aggressive: ValidationBehaviorFunction = () => true
    const change: ValidationBehaviorFunction = ({ force }) => !force
    const lazy: ValidationBehaviorFunction = ({ touched }) => touched
    const lazier: ValidationBehaviorFunction = ({
      force,
      touched,
      submit,
      hasError
    }) => force || submit || (touched && hasError)
    const submit: ValidationBehaviorFunction = ({ submit, hasError }) =>
      submit || hasError
    const force: ValidationBehaviorFunction = ({ force, submit }) =>
      force || submit

    this.defaultValidationBehavior = 'lazier'
    this.validationBehavior = new Map([
      ['aggressive', aggressive],
      ['change', change],
      ['lazy', lazy],
      ['lazier', lazier],
      ['submit', submit],
      ['force', force]
    ])
  }

  getDefaultValidationBehavior() {
    return this.validationBehavior.get(this.defaultValidationBehavior)!
  }
}

export const VALIDATION_CONFIG = new ValidationConfig()
