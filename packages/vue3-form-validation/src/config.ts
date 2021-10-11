import { ValidationBehavior, ValidationBehaviorString } from './form'

export class Config {
  defaultValidationBehavior: ValidationBehaviorString
  validationBehavior: Map<string, ValidationBehavior>

  constructor() {
    const aggresive: ValidationBehavior = () => true
    const lazy: ValidationBehavior = ({ touched }) => touched
    const lazier: ValidationBehavior = ({ touched, hasError }) =>
      touched && hasError

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
