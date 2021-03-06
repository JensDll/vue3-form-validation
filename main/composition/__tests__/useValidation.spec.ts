import { ref } from 'vue';
import Form from '../../Form';
import { cleanupForm } from '../../utils';
import { Field, useValidation } from '../useValidation';

type TestObject = {
  a: Field<string>;
  b: Field<string>;
  cs: Field<string[]>;
  d: Field<{ a: string }>;
  es: {
    f: Field<string>;
    gs: {
      h: Field<{
        a: {
          b: {
            c: string;
          };
        };
      }>;
    }[];
  }[];
};

const testDataFactory = (): TestObject => ({
  a: {
    $value: ''
  },
  b: {
    $value: ref('')
  },
  cs: {
    $value: []
  },
  d: {
    $value: {
      a: ''
    }
  },
  es: [
    {
      f: {
        $value: ''
      },
      gs: []
    },
    {
      f: {
        $value: ''
      },
      gs: [
        {
          h: {
            $value: {
              a: {
                b: {
                  c: ref('')
                }
              }
            }
          }
        }
      ]
    }
  ]
});

describe('transform form data', () => {
  it('should transform every field', () => {
    const formData = testDataFactory();

    const { form } = useValidation(formData);

    expect(form).toStrictEqual<typeof form>({
      a: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      b: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      cs: {
        $uid: expect.any(Number),
        $value: [],
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      d: {
        $uid: expect.any(Number),
        $value: { a: '' },
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      es: [
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $validating: false,
            $onBlur: expect.any(Function)
          },
          gs: []
        },
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $validating: false,
            $onBlur: expect.any(Function)
          },
          gs: [
            {
              h: {
                $uid: expect.any(Number),
                $value: {
                  a: {
                    b: {
                      c: ''
                    }
                  }
                },
                $errors: [],
                $validating: false,
                $onBlur: expect.any(Function)
              }
            }
          ]
        }
      ]
    });
  });
});

describe('reset fields', () => {
  it('should reset every field', () => {
    const formData = testDataFactory();

    const { form, resetFields } = useValidation(formData);

    form.a.$value = 'foo';
    form.b.$value = 'foo';
    form.cs.$value = ['foo'];
    form.d.$value.a = 'foo';
    form.es[0].f.$value = 'foo';
    form.es[1].f.$value = 'foo';
    form.es[1].gs[0].h.$value.a.b.c = 'foo';

    resetFields();

    expect(form).toStrictEqual<typeof form>({
      a: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      b: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      cs: {
        $uid: expect.any(Number),
        $value: [],
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      d: {
        $uid: expect.any(Number),
        $value: { a: '' },
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      es: [
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $validating: false,
            $onBlur: expect.any(Function)
          },
          gs: []
        },
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $validating: false,
            $onBlur: expect.any(Function)
          },
          gs: [
            {
              h: {
                $uid: expect.any(Number),
                $value: {
                  a: {
                    b: {
                      c: ''
                    }
                  }
                },
                $errors: [],
                $validating: false,
                $onBlur: expect.any(Function)
              }
            }
          ]
        }
      ]
    });
  });

  it('should reset every field to a specific value', () => {
    const formData = testDataFactory();

    const { form, resetFields } = useValidation(formData);

    resetFields({
      a: 'foo',
      b: 'foo',
      cs: ['foo'],
      d: { a: 'foo' },
      es: [
        { f: 'foo', gs: [] },
        {
          f: 'foo',
          gs: [
            {
              h: {
                a: {
                  b: {
                    c: 'foo'
                  }
                }
              }
            }
          ]
        }
      ]
    });

    expect(form).toStrictEqual<typeof form>({
      a: {
        $uid: expect.any(Number),
        $value: 'foo',
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      b: {
        $uid: expect.any(Number),
        $value: 'foo',
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      cs: {
        $uid: expect.any(Number),
        $value: ['foo'],
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      d: {
        $uid: expect.any(Number),
        $value: { a: 'foo' },
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      es: [
        {
          f: {
            $uid: expect.any(Number),
            $value: 'foo',
            $errors: [],
            $validating: false,
            $onBlur: expect.any(Function)
          },
          gs: []
        },
        {
          f: {
            $uid: expect.any(Number),
            $value: 'foo',
            $errors: [],
            $validating: false,
            $onBlur: expect.any(Function)
          },
          gs: [
            {
              h: {
                $uid: expect.any(Number),
                $value: {
                  a: {
                    b: {
                      c: 'foo'
                    }
                  }
                },
                $errors: [],
                $validating: false,
                $onBlur: expect.any(Function)
              }
            }
          ]
        }
      ]
    });
  });
});

describe('cleanup form', () => {
  let mockOnDelete: jest.Mock;
  let mockForm: Form;

  beforeEach(() => {
    mockOnDelete = jest.fn();
    mockForm = ({
      onDelete: mockOnDelete
    } as any) as Form;
  });

  it('should call onDelete for every field', () => {
    const formData = testDataFactory();

    const { form } = useValidation(formData);

    cleanupForm(mockForm, form);

    expect(mockOnDelete).toHaveBeenCalledTimes(7);
  });

  it('should call onDelete for a subset of fields', () => {
    const formData = testDataFactory();

    const { form } = useValidation(formData);

    cleanupForm(mockForm, form.es);

    expect(mockOnDelete).toHaveBeenCalledTimes(3);
  });
});

describe('get result form data', () => {
  it('should only keep the value property', async () => {
    const formData = testDataFactory();

    const { validateFields } = useValidation(formData);

    const resultData = await validateFields();

    expect(resultData).toStrictEqual<typeof resultData>({
      a: '',
      b: '',
      cs: [],
      d: {
        a: ''
      },
      es: [
        {
          f: '',
          gs: []
        },
        {
          f: '',
          gs: [
            {
              h: {
                a: {
                  b: {
                    c: ''
                  }
                }
              }
            }
          ]
        }
      ]
    });
  });
});

describe('add and remove', () => {
  it('should append object to array', () => {
    const formData = testDataFactory();

    const { form, add } = useValidation(formData);

    add(['es'], {
      f: {
        $value: ref('')
      },
      gs: []
    });

    expect(form).toStrictEqual<typeof form>({
      a: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      b: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      cs: {
        $uid: expect.any(Number),
        $value: [],
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      d: {
        $uid: expect.any(Number),
        $value: { a: '' },
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      es: [
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $validating: false,
            $onBlur: expect.any(Function)
          },
          gs: []
        },
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $validating: false,
            $onBlur: expect.any(Function)
          },
          gs: [
            {
              h: {
                $uid: expect.any(Number),
                $value: {
                  a: {
                    b: {
                      c: ''
                    }
                  }
                },
                $errors: [],
                $validating: false,
                $onBlur: expect.any(Function)
              }
            }
          ]
        },
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $validating: false,
            $onBlur: expect.any(Function)
          },
          gs: []
        }
      ]
    });
  });

  it('should remove object from array', () => {
    const formData = testDataFactory();

    const { form, remove } = useValidation(formData);

    remove(['es'], 1);

    expect(form).toStrictEqual<typeof form>({
      a: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      b: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      cs: {
        $uid: expect.any(Number),
        $value: [],
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      d: {
        $uid: expect.any(Number),
        $value: { a: '' },
        $errors: [],
        $validating: false,
        $onBlur: expect.any(Function)
      },
      es: [
        {
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $validating: false,
            $onBlur: expect.any(Function)
          },
          gs: []
        }
      ]
    });
  });
});
