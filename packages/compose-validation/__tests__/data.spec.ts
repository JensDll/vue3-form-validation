import { reactive } from 'vue-demi'
import { MockedObject } from 'ts-jest/dist/utils/testing'

import { Tuple } from '@compose-validation/shared'
import { makeMocks } from '@compose-validation/jest-helper'
import {
  Field,
  getResultFormData,
  TransformFormData,
  transformFormData,
  resetFields,
  disposeForm,
  mapFieldRules
} from '../src/data'
import { Form } from '../src/Form'
import { RuleInformation } from '../src/rules'

type FormData = {
  a: Field<string, { extra: string }>
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

jest.mock('../src/Form')
jest.mock('../src/ValidationConfig')

let form: MockedObject<Form>
let formData: FormData
let transformedFormData: TransformFormData<FormData>
let mocks: Tuple<jest.Mock, 2>

beforeEach(() => {
  mocks = makeMocks(2)
  formData = {
    a: {
      $value: '',
      $rules: [() => {}, { key: 'a', rule: () => {} }],
      extra: 'extra'
    },
    b: { $value: '', $rules: [() => {}, { key: 'b', rule: () => {} }] },
    cs: [
      {
        d: { $value: '', $rules: [() => {}, { key: 'd', rule: () => {} }] },
        e: { $value: '', $rules: [() => {}, { key: 'e', rule: () => {} }] }
      },
      {
        d: { $value: '', $rules: [() => {}, { key: 'd', rule: () => {} }] },
        e: { $value: '', $rules: [() => {}, { key: 'e', rule: () => {} }] }
      },
      {
        d: { $value: '', $rules: [() => {}, { key: 'd', rule: () => {} }] },
        e: { $value: '', $rules: [() => {}, { key: 'e', rule: () => {} }] }
      }
    ],
    some: { extra: '', stuff: [1, 2, 3] }
  }
  form = new Form() as any
  transformFormData(form, formData)
  transformedFormData = reactive(formData) as any
})

describe('mapFieldRules', () => {
  it('simple rule', () => {
    const ruleInfo = mapFieldRules([mocks[0]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule: mocks[0]
      }
    ])
  })

  it('keyed rule', () => {
    const ruleInfo = mapFieldRules([
      {
        key: 'key',
        rule: mocks[0]
      }
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule: {
          key: 'key',
          rule: mocks[0]
        }
      }
    ])
  })

  it('simple rule with validation behavior string', () => {
    const ruleInfo = mapFieldRules([['lazy' as never, mocks[0]]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule: mocks[0]
      }
    ])
  })

  it('keyed rule with validation behavior string', () => {
    const ruleInfo = mapFieldRules([
      [
        'lazy' as never,
        {
          key: 'key',
          rule: mocks[0]
        }
      ]
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule: {
          key: 'key',
          rule: mocks[0]
        }
      }
    ])
  })

  it('simple rule with validation behavior inline', () => {
    const ruleInfo = mapFieldRules([[mocks[0], mocks[1]]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: mocks[0],
        rule: mocks[1]
      }
    ])
  })

  it('keyed rule with validation behavior inline', () => {
    const ruleInfo = mapFieldRules([
      [
        mocks[0],
        {
          key: 'key',
          rule: mocks[1]
        }
      ]
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: mocks[0],
        rule: {
          key: 'key',
          rule: mocks[1]
        }
      }
    ])
  })

  it('simple rule with validation behavior string and debounce', () => {
    const ruleInfo = mapFieldRules([['lazy' as never, mocks[0], 100]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule: mocks[0],
        debounce: 100
      }
    ])
  })

  it('keyed rule with validation behavior string and debounce', () => {
    const ruleInfo = mapFieldRules([
      [
        'lazy' as never,
        {
          key: 'key',
          rule: mocks[0]
        },
        100
      ]
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule: {
          key: 'key',
          rule: mocks[0]
        },
        debounce: 100
      }
    ])
  })

  it('simple rule with validation behavior inline and debounce', () => {
    const ruleInfo = mapFieldRules([[mocks[0], mocks[1], 100]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: mocks[0],
        rule: mocks[1],
        debounce: 100
      }
    ])
  })

  it('keyed rule with validation behavior inline and debounce', () => {
    const ruleInfo = mapFieldRules([
      [
        mocks[0],
        {
          key: 'key',
          rule: mocks[1]
        },
        100
      ]
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: mocks[0],
        rule: {
          key: 'key',
          rule: mocks[1]
        },
        debounce: 100
      }
    ])
  })

  it('simple rule with debounce', () => {
    const ruleInfo = mapFieldRules([[mocks[0], 100]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule: mocks[0],
        debounce: 100
      }
    ])
  })

  it('keyed rule with debounce', () => {
    const ruleInfo = mapFieldRules([
      [
        {
          key: 'key',
          rule: mocks[0]
        },
        100
      ]
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule: {
          key: 'key',
          rule: mocks[0]
        },
        debounce: 100
      }
    ])
  })

  it('should throw error for invalid input', () => {
    expect(() => {
      // @ts-expect-error
      mapFieldRules([['x', mocks[0]]])
    }).toThrow()
  })
})

describe('transformFormData', () => {
  it.only('should transform every field', () => {
    expect(transformedFormData).toStrictEqual({
      a: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $hasError: false,
        $hasErrors: [false, false],
        $validating: false,
        $dirty: false,
        $touched: false,
        $validate: expect.any(Function),
        extra: 'extra'
      },
      b: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],

        $hasError: false,
        $hasErrors: [false, false],
        $validating: false,
        $dirty: false,
        $touched: false,
        $validate: expect.any(Function)
      },
      cs: [
        {
          d: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],

            $hasError: false,
            $hasErrors: [false, false],
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          e: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],

            $hasError: false,
            $hasErrors: [false, false],
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          }
        },
        {
          d: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $hasError: false,
            $hasErrors: [false, false],
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          e: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $hasError: false,
            $hasErrors: [false, false],
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          }
        },
        {
          d: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $hasError: false,
            $hasErrors: [false, false],
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          e: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $hasError: false,
            $hasErrors: [false, false],
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          }
        }
      ],
      some: { extra: '', stuff: [1, 2, 3] }
    })
  })
})

describe('getResultFormData', () => {
  it('should only keep the value properties', () => {
    const resultFormData = getResultFormData(transformedFormData)
    expect(resultFormData).toStrictEqual({
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

  it('should filter when provided a predicate', () => {
    const resultFormData = getResultFormData(
      transformedFormData,
      ({ key }) => key !== 'e'
    )
    expect(resultFormData).toStrictEqual({
      a: '',
      b: '',
      cs: [{ d: '' }, { d: '' }, { d: '' }],
      some: { extra: '', stuff: [1, 2, 3] }
    })
  })
})

describe('resetFields', () => {
  it('should reset fields to passed values and not trigger validation', done => {
    resetFields(
      form,
      {
        a: 'a',
        b: 'b',
        cs: [
          { d: 'd1', e: 'e1' },
          { d: 'd2', e: 'e2' },
          { d: 'd3', e: 'e3' }
        ],
        some: { extra: 'extra', stuff: [-1, -1, -1] }
      },
      transformedFormData
    )

    expect(transformedFormData).toStrictEqual({
      a: {
        $uid: expect.any(Number),
        $value: 'a',
        $errors: [],
        $hasError: false,
        $hasErrors: [false, false],
        $validating: false,
        $dirty: false,
        $touched: false,
        $validate: expect.any(Function),
        extra: 'extra'
      },
      b: {
        $uid: expect.any(Number),
        $value: 'b',
        $errors: [],
        $hasError: false,
        $hasErrors: [false, false],
        $validating: false,
        $dirty: false,
        $touched: false,
        $validate: expect.any(Function)
      },
      cs: [
        {
          d: {
            $uid: expect.any(Number),
            $value: 'd1',
            $errors: [],
            $hasError: false,
            $hasErrors: [false, false],
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          e: {
            $uid: expect.any(Number),
            $value: 'e1',
            $errors: [],
            $hasError: false,
            $hasErrors: [false, false],
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          }
        },
        {
          d: {
            $uid: expect.any(Number),
            $value: 'd2',
            $errors: [],
            $hasError: false,
            $hasErrors: [false, false],
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          e: {
            $uid: expect.any(Number),
            $value: 'e2',
            $errors: [],
            $hasError: false,
            $hasErrors: [false, false],
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          }
        },
        {
          d: {
            $uid: expect.any(Number),
            $value: 'd3',
            $errors: [],
            $hasError: false,
            $hasErrors: [false, false],
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          },
          e: {
            $uid: expect.any(Number),
            $value: 'e3',
            $errors: [],
            $hasError: false,
            $hasErrors: [false, false],
            $validating: false,
            $dirty: false,
            $touched: false,
            $validate: expect.any(Function)
          }
        }
      ],
      some: { extra: '', stuff: [1, 2, 3] }
    })

    setTimeout(() => {
      expect(form.validate).toHaveBeenCalledTimes(0)
      done()
    }, 0)
  })
})

describe('disposeForm', () => {
  it('should clear dictionaries in Form for every removed field', () => {
    expect(form.dispose).toHaveBeenCalledTimes(0)
    expect(form.simpleValidators.size).toBe(8)
    expect(form.keyedValidators.size).toBe(4)
    expect(form.reactiveFields.size).toBe(8)
    disposeForm(form, formData)
    expect(form.dispose).toHaveBeenCalledTimes(8)
    expect(form.simpleValidators.size).toBe(0)
    expect(form.keyedValidators.size).toBe(0)
    expect(form.reactiveFields.size).toBe(0)
  })

  it('should clear dictionaries in Form for every removed field (subset)', () => {
    expect(form.dispose).toHaveBeenCalledTimes(0)
    expect(form.simpleValidators.size).toBe(8)
    expect(form.keyedValidators.size).toBe(4)
    expect(form.reactiveFields.size).toBe(8)
    disposeForm(form, formData.cs)
    expect(form.dispose).toHaveBeenCalledTimes(6)
    expect(form.simpleValidators.size).toBe(2)
    expect(form.keyedValidators.size).toBe(2)
    expect(form.reactiveFields.size).toBe(2)
  })
})
