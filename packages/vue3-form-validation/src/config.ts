import {
  ValidationBehaviorFunction,
  ValidationBehaviorString
} from './form/types'

export type Config = {
  defaultValidationBehavior: ValidationBehaviorString
  customValidationBehavior: Map<string, ValidationBehaviorFunction>
}

export const CONFIG: Config = {
  defaultValidationBehavior: 'lazier',
  customValidationBehavior: new Map()
}
