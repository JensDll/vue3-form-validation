import { Plugin } from 'vue'
import { CONFIG } from './config'
import { ValidationBehavior, ValidationBehaviorString } from './form'
import * as n_domain from './domain'

export type Configuration = {
  defaultValidationBehavior?: ValidationBehaviorString
  validationBehavior?: {
    [key: string]: ValidationBehavior
  }
}

/**
 *
 * @description
 * Configure the validation behavior of `useValidation`
 * @param configuration - Form validation configuration
 */
export function configureValidation(configuration: Configuration = {}): Plugin {
  return {
    install() {
      CONFIG.defaultValidationBehavior =
        configuration.defaultValidationBehavior ?? 'lazier'

      for (const [key, validationBehavior] of Object.entries(
        configuration.validationBehavior ?? {}
      )) {
        n_domain.trySet(CONFIG.validationBehavior)({
          failure() {
            console.warn(
              `Validation behavior with name '${key}' already exists`
            )
          }
        })(key, validationBehavior)
      }
    }
  }
}
