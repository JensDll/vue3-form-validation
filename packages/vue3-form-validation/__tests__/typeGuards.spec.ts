import { isSimpleRule } from '../src/rules'
import { isField, isTransformedField } from '../src/data'

describe('isField', () => {
  it('field -> true', () => {
    expect(
      isField({
        $value: '',
        $rules: []
      })
    ).toBe(true)
  })
})

describe('isTransformedField', () => {
  it('transformedField -> true', () => {
    expect(
      isTransformedField({
        $uid: 1,
        $value: '',
        $errors: []
      })
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
      rule: () => {}
    })
  })

  it('rule without key -> true', () => {
    isSimpleRule(() => {})
  })
})
