import { ref, Ref } from 'vue'

import { useValidation, UseValidation } from '../src/useValidation'
import { Field, TransformFormData, ValidationError } from '../src/form'
import { makeMocks, makePromise } from './utils'

type FormData = {
  a: Field<string>
  b: Field<string>
  c: Field<number[]>
  d: Field<{ a: string }>
  es: {
    f: Field<string>
    gs: {
      h: Field<{
        a: {
          b: {
            c: Ref<number[]>
          }
        }
      }>
    }[]
  }[]
}

let formData: FormData
let mockRule: jest.Mock

beforeEach(() => {
  mockRule = makeMocks(1, { timeout: 50 })[0]

  formData = {
    a: {
      $value: ref(''),
      $rules: [mockRule]
    },
    b: {
      $value: ref(''),
      $rules: [mockRule]
    },
    c: {
      $value: [1, 2, 3],
      $rules: [mockRule]
    },
    d: {
      $value: {
        a: ''
      },
      $rules: [mockRule]
    },
    es: [
      {
        f: {
          $value: '',
          $rules: [mockRule]
        },
        gs: []
      },
      {
        f: {
          $value: '',
          $rules: [mockRule]
        },
        gs: [
          {
            h: {
              $value: {
                a: {
                  b: {
                    c: ref([1, 2, 3])
                  }
                }
              },
              $rules: [mockRule]
            }
          }
        ]
      }
    ]
  }
})

const changeFormValues = (form: TransformFormData<FormData>) => {
  form.a.$value = 'x'
  form.b.$value = 'x'
  form.c.$value[0] = -1
  form.c.$value[1] = -1
  form.c.$value[2] = -1
  form.d.$value.a = 'x'
  form.es[0].f.$value = 'x'
  form.es[1].f.$value = 'x'
  form.es[1].gs[0].h.$value.a.b.c[0] = -1
  form.es[1].gs[0].h.$value.a.b.c[1] = -1
  form.es[1].gs[0].h.$value.a.b.c[2] = -1
  form.es[1].gs[0].h.$value.a.b.c[3] = -1
  form.es[1].gs[0].h.$value.a.b.c[4] = -1
}

test('should not change result data when changing form after submitting', async () => {
  const { form, validateFields } = useValidation<FormData>(formData)

  const promise = validateFields()

  changeFormValues(form)

  const resultData = await promise

  expect(resultData).toStrictEqual<typeof resultData>({
    a: '',
    b: '',
    c: [1, 2, 3],
    d: { a: '' },
    es: [
      { f: '', gs: [] },
      {
        f: '',
        gs: [
          {
            h: { a: { b: { c: [1, 2, 3] } } }
          }
        ]
      }
    ]
  })
  expect(mockRule).toBeCalledTimes(7)
})

describe('reset fields', () => {
  test('multiple times to default values', () => {
    const { form, resetFields } = useValidation<FormData>(formData)

    for (let i = 0; i < 10; i++) {
      changeFormValues(form)

      resetFields()

      expect(form).toStrictEqual<typeof form>({
        a: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $rawErrors: [null],
          $hasError: false,
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        },
        b: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $rawErrors: [null],
          $hasError: false,
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        },
        c: {
          $uid: expect.any(Number),
          $value: [1, 2, 3],
          $errors: [],
          $rawErrors: [null],
          $hasError: false,
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        },
        d: {
          $uid: expect.any(Number),
          $value: { a: '' },
          $errors: [],
          $rawErrors: [null],
          $hasError: false,
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        },
        es: [
          {
            f: {
              $uid: expect.any(Number),
              $value: '',
              $errors: [],
              $rawErrors: [null],
              $hasError: false,
              $validating: false,
              $dirty: false,
              $touched: false,
              $validate: expect.any(Function)
            },
            gs: []
          },
          {
            f: {
              $uid: expect.any(Number),
              $value: '',
              $errors: [],
              $rawErrors: [null],
              $hasError: false,
              $validating: false,
              $dirty: false,
              $touched: false,
              $validate: expect.any(Function)
            },
            gs: [
              {
                h: {
                  $uid: expect.any(Number),
                  $value: {
                    a: {
                      b: {
                        c: [1, 2, 3]
                      }
                    }
                  },
                  $errors: [],
                  $rawErrors: [null],
                  $hasError: false,
                  $validating: false,
                  $dirty: false,
                  $touched: false,
                  $validate: expect.any(Function)
                }
              }
            ]
          }
        ]
      })
    }

    expect(mockRule).toBeCalledTimes(0)
  })

  test('multiple times to specific values', () => {
    const { form, resetFields } = useValidation<FormData>(formData)

    for (let i = 0; i < 10; i++) {
      changeFormValues(form)

      resetFields({
        a: 'foo',
        b: 'foo',
        c: [42, 42, 42],
        d: { a: 'foo' },
        es: [
          { f: 'foo', gs: [] },
          {
            f: 'foo',
            gs: [
              {
                h: { a: { b: { c: [42, 42, 42] } } }
              }
            ]
          }
        ]
      })

      expect(form).toStrictEqual<typeof form>({
        a: {
          $uid: expect.any(Number),
          $value: 'foo',
          $errors: [],
          $hasError: false,
          $rawErrors: [null],
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        },
        b: {
          $uid: expect.any(Number),
          $value: 'foo',
          $errors: [],
          $rawErrors: [null],
          $hasError: false,
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        },
        c: {
          $uid: expect.any(Number),
          $value: [42, 42, 42],
          $errors: [],
          $rawErrors: [null],
          $hasError: false,
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        },
        d: {
          $uid: expect.any(Number),
          $value: { a: 'foo' },
          $errors: [],
          $rawErrors: [null],
          $hasError: false,
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        },
        es: [
          {
            f: {
              $uid: expect.any(Number),
              $value: 'foo',
              $errors: [],
              $rawErrors: [null],
              $hasError: false,
              $validating: false,
              $dirty: false,
              $touched: false,
              $validate: expect.any(Function)
            },
            gs: []
          },
          {
            f: {
              $uid: expect.any(Number),
              $value: 'foo',
              $errors: [],
              $rawErrors: [null],
              $hasError: false,
              $validating: false,
              $dirty: false,
              $touched: false,
              $validate: expect.any(Function)
            },
            gs: [
              {
                h: {
                  $uid: expect.any(Number),
                  $value: {
                    a: {
                      b: {
                        c: [42, 42, 42]
                      }
                    }
                  },
                  $errors: [],
                  $rawErrors: [null],
                  $hasError: false,
                  $validating: false,
                  $dirty: false,
                  $touched: false,
                  $validate: expect.any(Function)
                }
              }
            ]
          }
        ]
      })
    }

    expect(mockRule).toBeCalledTimes(0)
  })

  test('multiple times to specific and default values', () => {
    const { form, resetFields } = useValidation<FormData>(formData)

    for (let i = 0; i < 20; i++) {
      changeFormValues(form)

      if (i % 2 === 0) {
        resetFields({
          a: 'foo',
          b: 'foo',
          c: [42, 42, 42],
          d: { a: 'foo' },
          es: [
            { f: 'foo', gs: [] },
            {
              f: 'foo',
              gs: [
                {
                  h: { a: { b: { c: [42, 42, 42] } } }
                }
              ]
            }
          ]
        })

        expect(form).toStrictEqual<typeof form>({
          a: {
            $uid: expect.any(Number),
            $value: 'foo',
            $errors: [],
            $rawErrors: [null],
            $hasError: false,
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          b: {
            $uid: expect.any(Number),
            $value: 'foo',
            $errors: [],
            $rawErrors: [null],
            $hasError: false,
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          c: {
            $uid: expect.any(Number),
            $value: [42, 42, 42],
            $errors: [],
            $rawErrors: [null],
            $hasError: false,
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          d: {
            $uid: expect.any(Number),
            $value: { a: 'foo' },
            $errors: [],
            $rawErrors: [null],
            $hasError: false,
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          es: [
            {
              f: {
                $uid: expect.any(Number),
                $value: 'foo',
                $errors: [],
                $rawErrors: [null],
                $hasError: false,
                $dirty: false,
                $touched: false,
                $validating: false,
                $validate: expect.any(Function)
              },
              gs: []
            },
            {
              f: {
                $uid: expect.any(Number),
                $value: 'foo',
                $errors: [],
                $rawErrors: [null],
                $hasError: false,
                $validating: false,
                $dirty: false,
                $touched: false,
                $validate: expect.any(Function)
              },
              gs: [
                {
                  h: {
                    $uid: expect.any(Number),
                    $value: {
                      a: {
                        b: {
                          c: [42, 42, 42]
                        }
                      }
                    },
                    $errors: [],
                    $rawErrors: [null],
                    $hasError: false,
                    $validating: false,
                    $dirty: false,
                    $touched: false,
                    $validate: expect.any(Function)
                  }
                }
              ]
            }
          ]
        })
      } else {
        resetFields()

        expect(form).toStrictEqual<typeof form>({
          a: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $hasError: false,
            $rawErrors: [null],
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          b: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $rawErrors: [null],
            $hasError: false,
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          c: {
            $uid: expect.any(Number),
            $value: [1, 2, 3],
            $errors: [],
            $rawErrors: [null],
            $hasError: false,
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          d: {
            $uid: expect.any(Number),
            $value: { a: '' },
            $errors: [],
            $rawErrors: [null],
            $hasError: false,
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          es: [
            {
              f: {
                $uid: expect.any(Number),
                $value: '',
                $errors: [],
                $rawErrors: [null],
                $hasError: false,
                $validating: false,
                $dirty: false,
                $touched: false,
                $validate: expect.any(Function)
              },
              gs: []
            },
            {
              f: {
                $uid: expect.any(Number),
                $value: '',
                $errors: [],
                $rawErrors: [null],
                $hasError: false,
                $validating: false,
                $dirty: false,
                $touched: false,
                $validate: expect.any(Function)
              },
              gs: [
                {
                  h: {
                    $uid: expect.any(Number),
                    $value: {
                      a: {
                        b: {
                          c: [1, 2, 3]
                        }
                      }
                    },
                    $errors: [],
                    $rawErrors: [null],
                    $hasError: false,
                    $validating: false,
                    $dirty: false,
                    $touched: false,
                    $validate: expect.any(Function)
                  }
                }
              ]
            }
          ]
        })
      }
    }

    expect(mockRule).toBeCalledTimes(0)
  })
})

describe('validation', () => {
  describe.each([
    { debounce: true, note: 'with debounced rule' },
    { debounce: false, note: 'with async rule' }
  ])('should change field values correctly ($note)', ({ debounce }) => {
    let rule: jest.Mock
    let useVal: UseValidation<{
      a: Field<string>
    }>

    beforeEach(() => {
      rule = jest.fn(() => makePromise(50, 'Error'))
      useVal = useValidation({
        a: {
          $value: '',
          $rules: [debounce ? [() => true, rule, 100] : [() => true, rule]]
        }
      })
    })

    test('using `$validate`', async () => {
      const { form, submitting, validating } = useVal

      const promise = form.a.$validate()

      expect(form.a).toStrictEqual<typeof form.a>({
        $uid: expect.any(Number),
        $dirty: false,
        $touched: true,
        $errors: [],
        $hasError: false,
        $rawErrors: [null],
        $validate: expect.any(Function),
        $validating: true,
        $value: ''
      })
      expect(validating.value).toBe(true)
      expect(submitting.value).toBe(false)

      await promise

      expect(form.a).toStrictEqual<typeof form.a>({
        $uid: expect.any(Number),
        $dirty: false,
        $touched: true,
        $errors: ['Error'],
        $hasError: true,
        $rawErrors: ['Error'],
        $validate: expect.any(Function),
        $validating: false,
        $value: ''
      })
      expect(validating.value).toBe(false)
      expect(submitting.value).toBe(false)
    })

    test('using `validateFields`', async () => {
      const { form, submitting, validating, validateFields } = useVal

      const promise = validateFields()

      expect(form.a).toStrictEqual<typeof form.a>({
        $uid: expect.any(Number),
        $dirty: false,
        $touched: true,
        $errors: [],
        $hasError: false,
        $rawErrors: [null],
        $validate: expect.any(Function),
        $validating: true,
        $value: ''
      })
      expect(validating.value).toBe(true)
      expect(submitting.value).toBe(true)

      await expect(promise).rejects.toThrow(ValidationError)

      expect(form.a).toStrictEqual<typeof form.a>({
        $uid: expect.any(Number),
        $dirty: false,
        $touched: true,
        $errors: ['Error'],
        $hasError: true,
        $rawErrors: ['Error'],
        $validate: expect.any(Function),
        $validating: false,
        $value: ''
      })
      expect(validating.value).toBe(false)
      expect(submitting.value).toBe(false)
    })

    test('`resetFields` should cancel validation', async () => {
      const { form, submitting, validating, validateFields, resetFields } =
        useVal

      resetFields()

      const validatePromise = form.a.$validate()

      expect(form.a).toStrictEqual<typeof form.a>({
        $uid: expect.any(Number),
        $dirty: false,
        $touched: true,
        $errors: [],
        $hasError: false,
        $rawErrors: [null],
        $validate: expect.any(Function),
        $validating: true,
        $value: ''
      })
      expect(submitting.value).toBe(false)
      expect(validating.value).toBe(true)

      resetFields()

      await expect(validatePromise).resolves.toBeUndefined()

      expect(form.a).toStrictEqual<typeof form.a>({
        $uid: expect.any(Number),
        $dirty: false,
        $touched: false,
        $errors: [],
        $hasError: false,
        $rawErrors: [null],
        $validate: expect.any(Function),
        $validating: false,
        $value: ''
      })
      expect(submitting.value).toBe(false)
      expect(validating.value).toBe(false)

      const validateFieldsPromise = validateFields()

      expect(form.a).toStrictEqual<typeof form.a>({
        $uid: expect.any(Number),
        $dirty: false,
        $touched: true,
        $errors: [],
        $hasError: false,
        $rawErrors: [null],
        $validate: expect.any(Function),
        $validating: true,
        $value: ''
      })
      expect(submitting.value).toBe(true)
      expect(validating.value).toBe(true)

      resetFields()

      await expect(validateFieldsPromise).rejects.toThrow(ValidationError)

      expect(form.a).toStrictEqual<typeof form.a>({
        $uid: expect.any(Number),
        $dirty: false,
        $touched: false,
        $errors: [],
        $hasError: false,
        $rawErrors: [null],
        $validate: expect.any(Function),
        $validating: false,
        $value: ''
      })
      expect(submitting.value).toBe(false)
      expect(validating.value).toBe(false)
    })
  })
})

describe('add and remove', () => {
  test('add field', () => {
    const { form, add } = useValidation(formData)

    add(['es'], {
      f: {
        $value: ref('')
      },
      gs: []
    })

    expect(form).toStrictEqual<typeof form>({
      a: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $rawErrors: [null],
        $hasError: false,
        $validating: false,
        $dirty: false,
        $touched: false,
        $validate: expect.any(Function)
      },
      b: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $rawErrors: [null],
        $hasError: false,
        $validating: false,
        $dirty: false,
        $touched: false,
        $validate: expect.any(Function)
      },
      c: {
        $uid: expect.any(Number),
        $value: [1, 2, 3],
        $errors: [],
        $rawErrors: [null],
        $hasError: false,
        $validating: false,
        $dirty: false,
        $touched: false,
        $validate: expect.any(Function)
      },
      d: {
        $uid: expect.any(Number),
        $value: { a: '' },
        $errors: [],
        $rawErrors: [null],
        $hasError: false,
        $validating: false,
        $dirty: false,
        $touched: false,
        $validate: expect.any(Function)
      },
      es: [
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $rawErrors: [null],
            $hasError: false,
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          gs: []
        },
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $rawErrors: [null],
            $hasError: false,
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          gs: [
            {
              h: {
                $uid: expect.any(Number),
                $value: {
                  a: {
                    b: {
                      c: [1, 2, 3]
                    }
                  }
                },
                $errors: [],
                $rawErrors: [null],
                $hasError: false,
                $validating: false,
                $dirty: false,
                $touched: false,
                $validate: expect.any(Function)
              }
            }
          ]
        },
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $rawErrors: [],
            $hasError: false,
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          gs: []
        }
      ]
    })
  })

  test('remove field', () => {
    const { form, remove } = useValidation(formData)

    remove(['a'])
    remove(['es', 1])

    expect(form).toStrictEqual({
      b: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $rawErrors: [null],
        $hasError: false,
        $validating: false,
        $dirty: false,
        $touched: false,
        $validate: expect.any(Function)
      },
      c: {
        $uid: expect.any(Number),
        $value: [1, 2, 3],
        $errors: [],
        $rawErrors: [null],
        $hasError: false,
        $validating: false,
        $dirty: false,
        $touched: false,
        $validate: expect.any(Function)
      },
      d: {
        $uid: expect.any(Number),
        $value: { a: '' },
        $errors: [],
        $rawErrors: [null],
        $hasError: false,
        $validating: false,
        $dirty: false,
        $touched: false,
        $validate: expect.any(Function)
      },
      es: [
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $rawErrors: [null],
            $hasError: false,
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          gs: []
        }
      ]
    })
  })
})
