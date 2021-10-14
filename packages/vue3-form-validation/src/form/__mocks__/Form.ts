import { FormField } from '../FormField'

export const Form = jest.fn<any, any>().mockImplementation(() => {
  return {
    registerField: jest.fn((uid, name, modelValue, rules) => {
      const field = new FormField(name, modelValue, rules)
      return field
    }),
    validate: jest.fn(),
    onDelete: jest.fn()
  }
})
