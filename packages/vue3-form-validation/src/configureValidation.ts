import { Plugin } from 'vue'
import { CONFIG } from './config'
import {
  ValidationBehaviorFunction,
  ValidationBehaviorString
} from './form/types'

export type Configuration = {
  defaultValidationBehavior?: ValidationBehaviorString
  validationBehavior?: {
    [key: string]: ValidationBehaviorFunction
  }
}

export function configureValidation(configuration: Configuration = {}): Plugin {
  return {
    install() {
      CONFIG.defaultValidationBehavior =
        configuration.defaultValidationBehavior ?? 'lazier'
      for (const [key, validationBehaviorFunction] of Object.entries(
        configuration.validationBehavior ?? {}
      )) {
        CONFIG.customValidationBehavior.set(key, validationBehaviorFunction)
      }
    }
  }
}
