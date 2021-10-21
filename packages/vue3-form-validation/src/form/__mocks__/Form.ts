import { ref } from 'vue'

import { FormField } from '../FormField'

export const Form = jest.fn<any, any>().mockImplementation(() => {
  class MockForm {
    rulesValidating = ref(0)
    fields = new Map<number, FormField>()
    dispose = jest.fn()
    validate = jest.fn()
    registerField = jest.fn((uid, name, modelValue, rules) => {
      const field = new FormField(this as any, uid, name, modelValue, rules)
      this.fields.set(uid, field)
      return field
    })
    getField = jest.fn(uid => this.fields.get(uid))
  }

  return new MockForm()
})
