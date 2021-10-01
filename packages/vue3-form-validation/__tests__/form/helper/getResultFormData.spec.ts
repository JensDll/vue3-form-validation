import { Field, useValidation } from '../../../src/composition/useValidation'
import { getResultFormData } from '../../../src/form'

type FormData = {
  a: Field<string>
  b: Field<string>
  cs: {
    d: Field<string>
    e: Field<string>
  }[]
  some: {
    extra: string
    stuff: any[]
  }
}

const generateTestData = () =>
  useValidation<FormData>({
    a: { $value: '' },
    b: { $value: '' },
    cs: [
      { d: { $value: '' }, e: { $value: '' } },
      { d: { $value: '' }, e: { $value: '' } },
      { d: { $value: '' }, e: { $value: '' } }
    ],
    some: { extra: '', stuff: [1, 2, 3] }
  }).form

it('should only keep the value proerties', () => {
  const formData = generateTestData()

  expect(getResultFormData(formData)).toStrictEqual({
    a: '',
    b: '',
    cs: [
      { d: '', e: '' },
      { d: '', e: '' },
      { d: '', e: '' }
    ],
    some: { extra: '', stuff: [1, 2, 3] }
  })
})
