import { reactive } from 'vue'
import { MockedObject } from 'ts-jest/dist/utils/testing'
import {
  Form,
  Field,
  getResultFormData,
  TransformedFormData,
  transformFormData,
  resetFields,
  cleanupForm
} from '../../src/form'

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

jest.mock('../../src/form/Form')

let form: MockedObject<Form>
let formData: FormData
let transformedFormData: TransformedFormData<FormData>

beforeEach(() => {
  formData = {
    a: { $value: '', extra: 'extra' },
    b: { $value: '' },
    cs: [
      { d: { $value: '' }, e: { $value: '' } },
      { d: { $value: '' }, e: { $value: '' } },
      { d: { $value: '' }, e: { $value: '' } }
    ],
    some: { extra: '', stuff: [1, 2, 3] }
  }
  form = new Form() as any
  transformFormData(form, formData)
  transformedFormData = reactive(formData) as any
})

describe('transformFormData', () => {
  it('should transform every field', () => {
    expect(transformedFormData).toStrictEqual({
      a: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $hasError: false,
        $validating: false,
        $setTouched: expect.any(Function),
        extra: 'extra'
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
})

describe('getResultFormData', () => {
  it('should only keep the value proerties', () => {
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
})

describe('resetFields', () => {
  it('should reset fields to passed values', () => {
    resetFields(
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
        $validating: false,
        $setTouched: expect.any(Function),
        extra: 'extra'
      },
      b: {
        $uid: expect.any(Number),
        $value: 'b',
        $errors: [],
        $hasError: false,
        $validating: false,
        $setTouched: expect.any(Function)
      },
      cs: [
        {
          d: {
            $uid: expect.any(Number),
            $value: 'd1',
            $errors: [],
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          },
          e: {
            $uid: expect.any(Number),
            $value: 'e1',
            $errors: [],
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          }
        },
        {
          d: {
            $uid: expect.any(Number),
            $value: 'd2',
            $errors: [],
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          },
          e: {
            $uid: expect.any(Number),
            $value: 'e2',
            $errors: [],
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          }
        },
        {
          d: {
            $uid: expect.any(Number),
            $value: 'd3',
            $errors: [],
            $hasError: false,
            $validating: false,
            $setTouched: expect.any(Function)
          },
          e: {
            $uid: expect.any(Number),
            $value: 'e3',
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
})

describe('cleanupForm', () => {
  it('should call onDelete on form for every field', () => {
    cleanupForm(form, formData, new Map())
    expect(form.onDelete).toHaveBeenCalledTimes(8)
  })

  it('should call onDelete on form for a subset of fields', () => {
    cleanupForm(form, formData.cs, new Map())
    expect(form.onDelete).toHaveBeenCalledTimes(6)
  })
})
