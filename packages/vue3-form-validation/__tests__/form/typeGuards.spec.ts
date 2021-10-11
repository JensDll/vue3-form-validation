import {
  Field,
  TransformedField,
  isField,
  isTransformedField,
  isSimpleRule
} from '../../src/form'

describe('isField', () => {
  it('field -> true', () => {
    expect(
      isField({
        $value: '',
        $rules: [],
        $validationBehaviour: 'lazy'
      } as Field<unknown>)
    ).toBe(true)
  })
})

describe('isTransformedField', () => {
  it('transformedField -> true', () => {
    expect(
      isTransformedField({
        $uid: 1,
        $value: '',
        $errors: [],
        $hasError: false,
        $validating: false,
        async $setTouched() {
          // empty
        }
      } as TransformedField<unknown>)
    ).toBe(true)
  })
})

describe('isSimpleRule', () => {
  it('rule with key -> false', () => {
    isSimpleRule({
      key: ''
    })
  })

  it('rule with key -> false', () => {
    isSimpleRule({
      key: '',
      rule: () => {
        // empty
      }
    })
  })

  it('rule without key -> true', () => {
    isSimpleRule(() => {
      // empty
    })
  })
})
