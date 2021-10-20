import { FormField } from '../FormField'

export const Form = jest.fn<any, any>().mockImplementation(() => {
  const mock: any = {
    validate: jest.fn(),
    onDelete: jest.fn(),
    registerField: jest.fn((uid, name, modelValue, rules) => {
      const field = new FormField(mock, uid, name, modelValue, rules)
      return field
    })
  }

  return mock
})
