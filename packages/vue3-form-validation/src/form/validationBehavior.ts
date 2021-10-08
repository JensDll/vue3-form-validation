import { Form, KeyedValidators } from './Form'

export type ValidationBehaviorString = 'aggresive' | 'lazy' | 'lazier'
export type ValidationBehaviorInfo = {
  submitCount: number
  errorMessages: string[]
}
export type ValidationBehavior =
  | ValidationBehaviorString
  | ((info: ValidationBehaviorInfo) => ValidationBehaviorString | void)

const VALIDATION_BEHAVIOR_RESTRICTIVENESS: {
  [K in ValidationBehaviorString]: number
} = {
  aggresive: 0,
  lazy: 1,
  lazier: 2
}

const compareValidationBehavior = (
  a: ValidationBehaviorString,
  b: ValidationBehaviorString
) =>
  VALIDATION_BEHAVIOR_RESTRICTIVENESS[a] -
  VALIDATION_BEHAVIOR_RESTRICTIVENESS[b]

export const getMostRestrictiveValidationBehavior = (
  form: Form,
  keyedValidators: KeyedValidators
): ValidationBehaviorString => {
  let mostRestrictiveValidationBehavior: ValidationBehaviorString = 'aggresive'

  for (const { meta } of keyedValidators.values()) {
    const validationBehavior = meta.formField.getValidationBehavior(form)

    if (
      validationBehavior &&
      compareValidationBehavior(
        validationBehavior,
        mostRestrictiveValidationBehavior
      ) > 0
    ) {
      mostRestrictiveValidationBehavior = validationBehavior
    }
  }

  return mostRestrictiveValidationBehavior
}
