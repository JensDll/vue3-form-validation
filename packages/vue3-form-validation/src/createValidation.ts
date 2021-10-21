import { Plugin } from 'vue'
import { VALIDATION_CONFIG } from './validationConfig'
import {
  ValidationBehaviorFunction,
  ValidationBehaviorString,
  DefaultValidationBehaviorString
} from './form'
import * as n_domain from './domain'

export type ConfigurationValidationBehavior = n_domain.Optional<
  {
    [K in ValidationBehaviorString]: ValidationBehaviorFunction
  },
  DefaultValidationBehaviorString
>

export type Configuration =
  keyof UseValidation_CustomValidationBehavior extends never
    ? {
        defaultValidationBehavior: ValidationBehaviorString
        validationBehavior?: ConfigurationValidationBehavior
      }
    : {
        defaultValidationBehavior: ValidationBehaviorString
        validationBehavior: ConfigurationValidationBehavior
      }

/**
 *
 * Configure the validation behavior of `useValidation`.
 *
 * @param configuration - The Form validation configuration
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
