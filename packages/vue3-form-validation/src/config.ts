import { ValidationBehavior, ValidationBehaviorString } from './form'

export class Config {
  defaultValidationBehavior: ValidationBehaviorString
  validationBehavior: Map<string, ValidationBehavior>

  constructor() {
    const aggresive: ValidationBehavior = () => true
    const lazy: ValidationBehavior = ({ field }) => field.touched
    const lazier: ValidationBehavior = ({ field }) =>
      field.touched && field.errorMessages.length > 0

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

export const CONFIG = new Config()
