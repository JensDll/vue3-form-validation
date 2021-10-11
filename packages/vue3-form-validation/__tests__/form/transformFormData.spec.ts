import { Field } from '../../src/form'
import { useValidation } from '../../src/useValidation'

type FormData = {
  a: Field<string>
  b: Field<string>
  cs: {
    d: Field<string>
    e: Field<string>
  }[]
  some: {
    extra: string
    stuff: number[]
  }
}

it('should transform every field', () => {
  const { form } = useValidation<FormData>({
    a: { $value: '' },
    b: { $value: '' },
    cs: [
      { d: { $value: '' }, e: { $value: '' } },
      { d: { $value: '' }, e: { $value: '' } },
      { d: { $value: '' }, e: { $value: '' } }
    ],
    some: { extra: '', stuff: [1, 2, 3] }
  })

  expect(form).toStrictEqual<typeof form>({
    a: {
      $uid: expect.any(Number),
      $value: '',
      $errors: [],
      $hasError: false,
      $validating: false,
      $setTouched: expect.any(Function)
    },
    b: {
      $uid: expect.any(Number),
      $value: '',
      $errors: [],
      $hasError: false,
      $validating: false,
      $setTouched: expect.any(Function)
    },
    cs: [
      {
        d: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $hasError: false,
          $validating: false,
          $setTouched: expect.any(Function)
        },
        e: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $hasError: false,
          $validating: false,
          $setTouched: expect.any(Function)
        }
      },
      {
        d: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $hasError: false,
          $validating: false,
          $setTouched: expect.any(Function)
        },
        e: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $hasError: false,
          $validating: false,
          $setTouched: expect.any(Function)
        }
      },
      {
        d: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $hasError: false,
          $validating: false,
          $setTouched: expect.any(Function)
        },
        e: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $hasError: false,
          $validating: false,
          $setTouched: expect.any(Function)
        }
      }
    ],
    some: { extra: '', stuff: [1, 2, 3] }
  })
})
