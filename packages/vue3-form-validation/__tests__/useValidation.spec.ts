import { ref } from 'vue'
import { useValidation } from '../src/useValidation'
import { Field, TransformedFormData } from '../src/form'
import { makeMocks } from './utils'

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
            c: number[]
          }
        }
      }>
    }[]
  }[]
}

let formData: FormData

beforeEach(() => {
  const [mock] = makeMocks(1, { timeout: 50 })

  formData = {
    a: {
      $value: ref(''),
      $rules: [mock]
    },
    b: {
      $value: ref(''),
      $rules: [mock]
    },
    c: {
      $value: [1, 2, 3],
      $rules: [mock]
    },
    d: {
      $value: {
        a: ''
      },
      $rules: [mock]
    },
    es: [
      {
        f: {
          $value: '',
          $rules: [mock]
        },
        gs: []
      },
      {
        f: {
          $value: '',
          $rules: [mock]
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
              $rules: [mock]
            }
          }
        ]
      }
    ]
  }
})

const changeFormValues = (form: TransformedFormData<FormData>) => {
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

test('should not change result data when changing form after submitting', done => {
  const { form, validateFields } = useValidation<FormData>(formData)

  validateFields().then(formData => {
    expect(formData).toStrictEqual<typeof formData>({
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
    done()
  })

  changeFormValues(form)
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
  })

  test('multiple times to specific values and default values', () => {
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

    remove(['es', 1])

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
        }
      ]
    })
  })
})
