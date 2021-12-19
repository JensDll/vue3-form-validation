import { Plugin } from 'vue-demi'

import { VALIDATION_CONFIG } from './ValidationConfig'
import {
  ValidationBehaviorFunction,
  ValidationBehaviorString
} from './validationBehavior'

export type ConfigurationValidationBehavior = {
  [K in ValidationBehaviorString]: ValidationBehaviorFunction
}

export type Configuration = {
  defaultValidationBehavior: ValidationBehaviorString
  validationBehavior: ConfigurationValidationBehavior
}

/**
 * Configure the validation behavior of `useValidation`.
 *
 * @param configuration - The form validation configuration
 */
export function createValidation(configuration: Configuration): Plugin {
  return {
    install() {
      for (const [key, validationBehavior] of Object.entries(
        configuration.validationBehavior ?? {}
      ) as [ValidationBehaviorString, ValidationBehaviorFunction][]) {
        VALIDATION_CONFIG.validationBehavior.set(key, validationBehavior)
      }

      if (
        VALIDATION_CONFIG.validationBehavior.has(
          configuration.defaultValidationBehavior
        )
      ) {
        VALIDATION_CONFIG.defaultValidationBehavior =
          configuration.defaultValidationBehavior
      } else {
        console.warn(
          `[useValidation] Default validation behavior '${configuration.defaultValidationBehavior}' is not valid. Valid values are`,
          VALIDATION_CONFIG.validationBehavior.keys()
        )
      }
    }
  }
}
