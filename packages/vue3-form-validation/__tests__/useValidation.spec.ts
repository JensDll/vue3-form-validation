import { ref } from 'vue'
import { useValidation } from '../src/useValidation'
import { Field, TransformedFormData } from '../src/form'

type TestData = {
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

let testData: TestData

const delay = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(null)
    }, 100)
  })

beforeEach(() => {
  testData = {
    a: {
      $value: ref(''),
      $rules: [delay]
    },
    b: {
      $value: ref(''),
      $rules: [delay]
    },
    c: {
      $value: [1, 2, 3],
      $rules: [delay]
    },
    d: {
      $value: {
        a: ''
      },
      $rules: [delay]
    },
    es: [
      {
        f: {
          $value: '',
          $rules: [delay]
        },
        gs: []
      },
      {
        f: {
          $value: '',
          $rules: [delay]
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
              $rules: [delay]
            }
          }
        ]
      }
    ]
  }
})

const changeFormValues = (form: TransformedFormData<TestData>) => {
  form.a.$value = 'a'
  form.b.$value = 'b'
  form.c.$value[0] = 100
  form.c.$value[1] = 100
  form.c.$value[2] = 100
  form.c.$value[3] = 100
  form.c.$value[4] = 100
  form.d.$value.a = 'd.a'
  form.es[0].f.$value = 'f0'
  form.es[1].f.$value = 'f1'
  ;(form.es[1].gs[0].h.$value.a.b.c as any)[0] = 200
  ;(form.es[1].gs[0].h.$value.a.b.c as any)[1] = 200
  ;(form.es[1].gs[0].h.$value.a.b.c as any)[2] = 200
  ;(form.es[1].gs[0].h.$value.a.b.c as any)[3] = 200
  ;(form.es[1].gs[0].h.$value.a.b.c as any)[4] = 200
}

test('change form values after submitting', done => {
  const { form, validateFields } = useValidation<TestData>(testData)

  validateFields()
    .then(formData => {
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
    })
    .catch(e => {
      fail(e)
    })
    .finally(() => {
      done()
    })

  changeFormValues(form)
})

describe('reset fields', () => {
  test('mutiple times to default values', () => {
    const { form, resetFields } = useValidation<TestData>(testData)

    for (let i = 0; i < 10; i++) {
      changeFormValues(form)

      resetFields()

      expect(form).toStrictEqual<typeof form>({
        a: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $: {
            rawErrors: [null]
          },
          $hasError: false,
          $validating: false,
          $setTouched: expect.any(Function)
        },
        b: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $: {
            rawErrors: [null]
          },
          $hasError: false,
          $validating: false,
          $setTouched: expect.any(Function)
        },
        c: {
          $uid: expect.any(Number),
          $value: [1, 2, 3],
          $errors: [],
          $: {
            rawErrors: [null]
          },
          $hasError: false,
          $validating: false,
          $setTouched: expect.any(Function)
        },
        d: {
          $uid: expect.any(Number),
          $value: { a: '' },
          $errors: [],
          $: {
            rawErrors: [null]
          },
          $hasError: false,
          $validating: false,
          $setTouched: expect.any(Function)
        },
        es: [
          {
            f: {
              $uid: expect.any(Number),
              $value: '',
              $errors: [],
              $: {
                rawErrors: [null]
              },
              $hasError: false,
              $validating: false,
              $setTouched: expect.any(Function)
            },
            gs: []
          },
          {
            f: {
              $uid: expect.any(Number),
              $value: '',
              $errors: [],
              $: {
                rawErrors: [null]
              },
              $hasError: false,
              $validating: false,
              $setTouched: expect.any(Function)
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
                  $: {
                    rawErrors: [null]
                  },
                  $hasError: false,
                  $validating: false,
                  $setTouched: expect.any(Function)
                }
              }
            ]
          }
        ]
      })
    }
  })

  test('mutiple times to specific values', () => {
    const { form, resetFields } = useValidation<TestData>(testData)

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
                h: { a: { b: { c: [420, 420, 420] } } }
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
          $: {
            rawErrors: [null]
          },
          $validating: false,
          $setTouched: expect.any(Function)
        },
        b: {
          $uid: expect.any(Number),
          $value: 'foo',
          $errors: [],
          $: {
            rawErrors: [null]
          },
          $hasError: false,
          $validating: false,
          $setTouched: expect.any(Function)
        },
        c: {
          $uid: expect.any(Number),
          $value: [42, 42, 42],
          $errors: [],
          $: {
            rawErrors: [null]
          },
          $hasError: false,
          $validating: false,
          $setTouched: expect.any(Function)
        },
        d: {
          $uid: expect.any(Number),
          $value: { a: 'foo' },
          $errors: [],
          $: {
            rawErrors: [null]
          },
          $hasError: false,
          $validating: false,
          $setTouched: expect.any(Function)
        },
        es: [
          {
            f: {
              $uid: expect.any(Number),
              $value: 'foo',
              $errors: [],
              $: {
                rawErrors: [null]
              },
              $hasError: false,
              $validating: false,
              $setTouched: expect.any(Function)
            },
            gs: []
          },
          {
            f: {
              $uid: expect.any(Number),
              $value: 'foo',
              $errors: [],
              $: {
                rawErrors: [null]
              },
              $hasError: false,
              $validating: false,
              $setTouched: expect.any(Function)
            },
            gs: [
              {
                h: {
                  $uid: expect.any(Number),
                  $value: {
                    a: {
                      b: {
                        c: [420, 420, 420]
                      }
                    }
                  },
                  $errors: [],
                  $: {
                    rawErrors: [null]
                  },
                  $hasError: false,
                  $validating: false,
                  $setTouched: expect.any(Function)
                }
              }
            ]
          }
        ]
      })
    }
  })

  test('mutiple times to specific values and default values', () => {
    const { form, resetFields } = useValidation<TestData>(testData)

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
            $: {
              rawErrors: [null]
            },
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          },
          b: {
            $uid: expect.any(Number),
            $value: 'foo',
            $errors: [],
            $: {
              rawErrors: [null]
            },
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          },
          c: {
            $uid: expect.any(Number),
            $value: [42, 42, 42],
            $errors: [],
            $: {
              rawErrors: [null]
            },
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          },
          d: {
            $uid: expect.any(Number),
            $value: { a: 'foo' },
            $errors: [],
            $: {
              rawErrors: [null]
            },
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          },
          es: [
            {
              f: {
                $uid: expect.any(Number),
                $value: 'foo',
                $errors: [],
                $: {
                  rawErrors: [null]
                },
                $hasError: false,
                $validating: false,
                $setTouched: expect.any(Function)
              },
              gs: []
            },
            {
              f: {
                $uid: expect.any(Number),
                $value: 'foo',
                $errors: [],
                $: {
                  rawErrors: [null]
                },
                $hasError: false,
                $validating: false,
                $setTouched: expect.any(Function)
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
                    $: {
                      rawErrors: [null]
                    },
                    $hasError: false,
                    $validating: false,
                    $setTouched: expect.any(Function)
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
            $: {
              rawErrors: [null]
            },
            $validating: false,
            $setTouched: expect.any(Function)
          },
          b: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $: {
              rawErrors: [null]
            },
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          },
          c: {
            $uid: expect.any(Number),
            $value: [1, 2, 3],
            $errors: [],
            $: {
              rawErrors: [null]
            },
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          },
          d: {
            $uid: expect.any(Number),
            $value: { a: '' },
            $errors: [],
            $: {
              rawErrors: [null]
            },
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          },
          es: [
            {
              f: {
                $uid: expect.any(Number),
                $value: '',
                $errors: [],
                $: {
                  rawErrors: [null]
                },
                $hasError: false,
                $validating: false,
                $setTouched: expect.any(Function)
              },
              gs: []
            },
            {
              f: {
                $uid: expect.any(Number),
                $value: '',
                $errors: [],
                $: {
                  rawErrors: [null]
                },
                $hasError: false,
                $validating: false,
                $setTouched: expect.any(Function)
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
                    $: {
                      rawErrors: [null]
                    },
                    $hasError: false,
                    $validating: false,
                    $setTouched: expect.any(Function)
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
    const { form, add } = useValidation(testData)

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
        $: {
          rawErrors: [null]
        },
        $hasError: false,
        $validating: false,
        $setTouched: expect.any(Function)
      },
      b: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $: {
          rawErrors: [null]
        },
        $hasError: false,
        $validating: false,
        $setTouched: expect.any(Function)
      },
      c: {
        $uid: expect.any(Number),
        $value: [1, 2, 3],
        $errors: [],
        $: {
          rawErrors: [null]
        },
        $hasError: false,
        $validating: false,
        $setTouched: expect.any(Function)
      },
      d: {
        $uid: expect.any(Number),
        $value: { a: '' },
        $errors: [],
        $: {
          rawErrors: [null]
        },
        $hasError: false,
        $validating: false,
        $setTouched: expect.any(Function)
      },
      es: [
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $: {
              rawErrors: [null]
            },
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          },
          gs: []
        },
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $: {
              rawErrors: [null]
            },
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
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
                $: {
                  rawErrors: [null]
                },
                $hasError: false,
                $validating: false,
                $setTouched: expect.any(Function)
              }
            }
          ]
        },
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $: {
              rawErrors: []
            },
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          },
          gs: []
        }
      ]
    })
  })

  test('remove field', () => {
    const { form, remove } = useValidation(testData)

    remove(['es', 1])

    expect(form).toStrictEqual<typeof form>({
      a: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $: {
          rawErrors: [null]
        },
        $hasError: false,
        $validating: false,
        $setTouched: expect.any(Function)
      },
      b: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $: {
          rawErrors: [null]
        },
        $hasError: false,
        $validating: false,
        $setTouched: expect.any(Function)
      },
      c: {
        $uid: expect.any(Number),
        $value: [1, 2, 3],
        $errors: [],
        $: {
          rawErrors: [null]
        },
        $hasError: false,
        $validating: false,
        $setTouched: expect.any(Function)
      },
      d: {
        $uid: expect.any(Number),
        $value: { a: '' },
        $errors: [],
        $: {
          rawErrors: [null]
        },
        $hasError: false,
        $validating: false,
        $setTouched: expect.any(Function)
      },
      es: [
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $: {
              rawErrors: [null]
            },
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          },
          gs: []
        }
      ]
    })
  })
})
