import { Field, useValidation } from '../../../../composition/useValidation'
import { Form } from '../../../../form/Form'
import { cleanupForm } from '../cleanupForm'

let mockOnDelete: jest.Mock
let mockForm: Form

beforeEach(() => {
  mockOnDelete = jest.fn()
  mockForm = {
    onDelete: mockOnDelete
  } as any as Form
})

type FormData = {
  a: Field<string>
  b: Field<string>
  cs: {
    d: Field<string>
    e: Field<string>
  }[]
}

const generateTestData = () =>
  useValidation<FormData>({
    a: { $value: '' },
    b: { $value: '' },
    cs: [
      { d: { $value: '' }, e: { $value: '' } },
      { d: { $value: '' }, e: { $value: '' } },
      { d: { $value: '' }, e: { $value: '' } }
    ]
  }).form

it('should call onDelete for every field', () => {
  const formData = generateTestData()

  cleanupForm(mockForm, formData)

  expect(mockOnDelete).toHaveBeenCalledTimes(8)
})

it('should call onDelete for a subset of fields', () => {
  const formData = generateTestData()

  cleanupForm(mockForm, formData.cs)

  expect(mockOnDelete).toHaveBeenCalledTimes(6)
})
