import { Plugin } from 'vue'
import { VALIDATION_CONFIG } from './validationConfig'
import {
  ValidationBehavior,
  ValidationBehaviorString,
  DefaultValidationBehaviorString
} from './form'
import * as n_domain from './domain'

export type Configuration = {
  defaultValidationBehavior?: ValidationBehaviorString
  validationBehavior?: n_domain.Optional<
    {
      [K in ValidationBehaviorString]: ValidationBehavior
    },
    DefaultValidationBehaviorString
  >
}

/**
 *
 * @description
 * Configure the validation behavior of `useValidation`
 * @param configuration - Form validation configuration
 */
export function createValidation(configuration: Configuration): Plugin {
  return {
    install() {
      for (const [key, validationBehavior] of Object.entries(
        configuration.validationBehavior ?? {}
      ) as [ValidationBehaviorString, ValidationBehavior][]) {
        VALIDATION_CONFIG.validationBehavior.set(key, validationBehavior)
      }

      if (
        VALIDATION_CONFIG.validationBehavior.has(
          configuration.defaultValidationBehavior as any
        )
      ) {
        VALIDATION_CONFIG.defaultValidationBehavior =
          configuration.defaultValidationBehavior ?? 'lazier'
      } else {
        console.warn(
          `[useValidation] Default validation behavior is not valid. Valid values are`,
          VALIDATION_CONFIG.validationBehavior.keys()
        )
      }
    }
  }
}
