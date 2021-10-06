import { Field, useValidation } from '../../src/composition/useValidation'

type FormData = {
  a: Field<string>
  b: Field<string>
  cs: {
    d: Field<string>
    e: Field<string>
  }[]
}

it('should transform every field', () => {
  const { form } = useValidation<FormData>({
    a: { $value: '' },
    b: { $value: '' },
    cs: [
      { d: { $value: '' }, e: { $value: '' } },
      { d: { $value: '' }, e: { $value: '' } },
      { d: { $value: '' }, e: { $value: '' } }
    ]
  })

  expect(form).toStrictEqual<typeof form>({
    a: {
      $uid: expect.any(Number),
      $value: '',
      $errors: [],
      $hasError: false,
      $validating: false,
      $listener: expect.any(Object)
    },
    b: {
      $uid: expect.any(Number),
      $value: '',
      $errors: [],
      $hasError: false,
      $validating: false,
      $listener: expect.any(Object)
    },
    cs: [
      {
        d: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $hasError: false,
          $validating: false,
          $listener: expect.any(Object)
        },
        e: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $hasError: false,
          $validating: false,
          $listener: expect.any(Object)
        }
      },
      {
        d: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $hasError: false,
          $validating: false,
          $listener: expect.any(Object)
        },
        e: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $hasError: false,
          $validating: false,
          $listener: expect.any(Object)
        }
      },
      {
        d: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $hasError: false,
          $validating: false,
          $listener: expect.any(Object)
        },
        e: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $hasError: false,
          $validating: false,
          $listener: expect.any(Object)
        }
      }
    ]
  })
})
