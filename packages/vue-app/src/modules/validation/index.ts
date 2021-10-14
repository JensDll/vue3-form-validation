import { createValidation } from 'vue3-form-validation'

export const validation = createValidation({
  defaultValidationBehavior: 'lazier',
  validationBehavior: {
    force({ force, submit }) {
      return force || submit
    }
  }
})
