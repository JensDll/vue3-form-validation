import { createValidation } from 'vue3-form-validation'

export const validation = createValidation({
  defaultValidationBehavior: 'lazy',
  validationBehavior: {
    aggresive: () => true,
    lazy: ({ touched }) => touched,
    lazier: ({ force, touched, hasError }) => force || (touched && hasError),
    force: ({ force, hasError }) => hasError || force,
    submit: ({ submit, hasError }) => submit || hasError
  }
})
