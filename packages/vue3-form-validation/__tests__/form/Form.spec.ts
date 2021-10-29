import { ref, nextTick } from 'vue'

import { Form, FormField, ValidationBehaviorInfo } from '../../src/form'
import { makePromise } from '../utils'

let form: Form

beforeEach(() => {
  form = new Form()
})

describe('validation behavior', () => {
  let vbf: jest.Mock
  let rule: jest.Mock
  let field: FormField

  beforeEach(() => {
    vbf = jest.fn()
    rule = jest.fn()

    field = form.registerField(1, 'field', 'foo', [
      {
        validationBehavior: vbf,
        rule
      }
    ])
  })

  it('should call vbf before validating', () => {
    form.validate(1)

    expect(vbf).toBeCalledTimes(1)
    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: false,
      force: false,
      hasError: false,
      submit: false,
      touched: false,
      value: 'foo'
    })
  })

  it('with force flag', () => {
    form.validate(1, true)

    expect(vbf).toBeCalledTimes(1)
    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: false,
      force: true,
      hasError: false,
      submit: false,
      touched: false,
      value: 'foo'
    })
  })

  it('with submit flag', async () => {
    await form.validateAll()

    expect(vbf).toBeCalledTimes(1)
    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: false,
      force: false,
      hasError: false,
      submit: true,
      touched: true,
      value: 'foo'
    })
  })

  it('when touched', () => {
    field.touched.value = true

    form.validate(1)

    expect(vbf).toBeCalledTimes(1)
    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: false,
      force: false,
      hasError: false,
      submit: false,
      touched: true,
      value: 'foo'
    })
  })

  it('when dirty', async () => {
    field.modelValue.value = 'bar'

    await nextTick()

    expect(vbf).toBeCalledTimes(1)
    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: true,
      force: false,
      hasError: false,
      submit: false,
      touched: false,
      value: 'bar'
    })
  })

  it('with ref', () => {
    const vbf = jest.fn()
    const rule = jest.fn()

    field = form.registerField(1, 'field', ref('foo'), [
      {
        validationBehavior: vbf,
        rule
      }
    ])

    form.validate(1)

    expect(vbf).toBeCalledTimes(1)
    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: false,
      force: false,
      hasError: false,
      submit: false,
      touched: false,
      value: 'foo'
    })
  })

  it('with debounce', done => {
    const vbf = jest.fn()
    const rule = jest.fn()

    field = form.registerField(1, 'field', ref('foo'), [
      {
        validationBehavior: vbf,
        rule,
        debounce: 20
      }
    ])

    form.validate(1)

    setTimeout(() => {
      expect(vbf).toBeCalledTimes(1)
      expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
        dirty: false,
        force: false,
        hasError: false,
        submit: false,
        touched: false,
        value: 'foo'
      })
      done()
    }, 20)
  })

  it('should execute rule when vbf returns true and work with debounce', done => {
    const vbf = jest.fn(() => true)
    const rule = jest.fn()

    field = form.registerField(1, 'field', ref('foo'), [
      {
        validationBehavior: vbf,
        rule
      },
      {
        validationBehavior: vbf,
        rule,
        debounce: 20
      }
    ])

    form.validate(1)

    setTimeout(() => {
      expect(vbf).toBeCalledTimes(2)
      expect(vbf).nthCalledWith<ValidationBehaviorInfo[]>(1, {
        dirty: false,
        force: false,
        hasError: false,
        submit: false,
        touched: false,
        value: 'foo'
      })
      expect(vbf).nthCalledWith<ValidationBehaviorInfo[]>(2, {
        dirty: false,
        force: false,
        hasError: false,
        submit: false,
        touched: false,
        value: 'foo'
      })
      expect(rule).toBeCalledTimes(2)
      expect(rule).nthCalledWith(1, 'foo')
      expect(rule).nthCalledWith(2, 'foo')
      done()
    }, 20)
  })

  it('should not execute rule when vbf returns false', () => {
    const vbf = jest.fn(() => false)
    const rule = jest.fn()

    field = form.registerField(1, 'field', ref('foo'), [
      {
        validationBehavior: vbf,
        rule
      }
    ])

    form.validate(1)

    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: false,
      force: false,
      hasError: false,
      submit: false,
      touched: false,
      value: 'foo'
    })
    expect(rule).toBeCalledTimes(0)
  })
})

describe('validation', () => {
  it('async simple rule: should be validating and set error', done => {
    const vbf = jest.fn(() => true)
    const rule = jest.fn(() => makePromise('Error message', 20))

    const field = form.registerField(1, 'field', ref('foo'), [
      {
        validationBehavior: vbf,
        rule
      }
    ])

    form.validate(1)

    expect(field.validating.value).toBe(true)
    expect(field.errors.value).toStrictEqual([])
    expect(field.rawErrors).toStrictEqual([null])
    expect(rule).toBeCalledTimes(1)
    expect(rule).toBeCalledWith('foo')

    setTimeout(() => {
      expect(field.validating.value).toBe(false)
      expect(field.errors.value).toStrictEqual(['Error message'])
      expect(field.rawErrors).toStrictEqual(['Error message'])
      done()
    }, 20)
  })

  it('should only call keyed rule when all fields are touched', () => {
    const vbf = jest.fn(() => true)

    const rule1 = jest.fn(() => 'rule1')
    const field1 = form.registerField(1, 'field', 'foo', [
      {
        validationBehavior: vbf,
        rule: {
          key: 'key',
          rule: rule1
        }
      }
    ])

    const rule2 = jest.fn(() => 'rule2')
    const field2 = form.registerField(2, 'field', 'bar', [
      {
        validationBehavior: vbf,
        rule: {
          key: 'key',
          rule: rule2
        }
      }
    ])

    form.validate(1)
    field1.touched.value = true
    form.validate(1)
    field2.touched.value = true
    form.validate(1)

    expect(rule1).toBeCalledTimes(1)
    expect(rule1).toBeCalledWith('foo', 'bar')
    expect(rule2).toBeCalledTimes(1)
    expect(rule2).toBeCalledWith('foo', 'bar')
    expect(field1.errors.value).toStrictEqual(['rule1'])
    expect(field2.errors.value).toStrictEqual(['rule2'])
  })

  it('validateAll: should only validate fields with given names', async () => {
    const vbf = jest.fn(() => true)

    const rule1 = jest.fn()
    form.registerField(1, 'field1', 'foo', [
      {
        validationBehavior: vbf,
        rule: rule1
      }
    ])

    const rule2 = jest.fn()
    form.registerField(2, 'field2', 'bar', [
      {
        validationBehavior: vbf,
        rule: rule2
      }
    ])

    const rule3 = jest.fn()
    form.registerField(3, 'field3', 'baz', [
      {
        validationBehavior: vbf,
        rule: rule3
      }
    ])

    await Promise.all([
      form.validateAll(),
      form.validateAll(['field1']),
      form.validateAll(['field2', 'field3'])
    ])

    expect(rule1).toBeCalledTimes(2)
    expect(rule2).toBeCalledTimes(2)
    expect(rule3).toBeCalledTimes(2)
  })

  it.each([
    { debounce: true, note: 'with debounce' },
    { debounce: false, note: 'without debounce' }
  ])(
    'should cancel validating when resetting fields and not set errors afterwards ($note)',
    async ({ debounce }) => {
      const vbf = jest.fn(() => true)
      const rule1 = jest.fn(() => makePromise('rule1', 40))
      const rule2 = jest.fn(() => makePromise('rule2', 50))

      const field = form.registerField(1, 'field', 'foo', [
        {
          validationBehavior: vbf,
          rule: rule1
        },
        debounce
          ? {
              validationBehavior: vbf,
              rule: rule2,
              debounce: 50
            }
          : {
              validationBehavior: vbf,
              rule: rule2
            }
      ])

      form.validate(1)

      expect(field.rulesValidating.value).toBe(2)
      expect(form.rulesValidating.value).toBe(2)

      form.resetFields()

      expect(field.rulesValidating.value).toBe(0)
      expect(form.rulesValidating.value).toBe(0)

      form.validate(1)

      expect(field.rulesValidating.value).toBe(2)
      expect(form.rulesValidating.value).toBe(2)

      form.resetFields()

      expect(field.rulesValidating.value).toBe(0)
      expect(form.rulesValidating.value).toBe(0)

      await makePromise('', 150)

      expect(field.rulesValidating.value).toBe(0)
      expect(form.rulesValidating.value).toBe(0)
      expect(field.rawErrors).toStrictEqual([null, null])

      form.validate(1)

      expect(field.rulesValidating.value).toBe(2)
      expect(form.rulesValidating.value).toBe(2)

      await makePromise('', 150)

      expect(field.rulesValidating.value).toBe(0)
      expect(form.rulesValidating.value).toBe(0)
      expect(field.rawErrors).toStrictEqual(['rule1', 'rule2'])
    }
  )

  it('should prioritize last rule call', async () => {
    const testFactory = () =>
      new Promise<void>(resolve => {
        const ms = { value: 0 }
        let timeoutCalledTimes = 0

        const vbf = jest.fn(() => true)
        const rule = jest.fn(
          () =>
            new Promise(resolve => {
              const result = ms.value.toString()
              setTimeout(() => {
                resolve(result)
                if (++timeoutCalledTimes === 6) {
                  callback()
                }
              }, ms.value)
            })
        )

        const callback = () => {
          expect(vbf).toBeCalledTimes(6)
          expect(rule).toHaveBeenCalledTimes(6)
          expect(timeoutCalledTimes).toBe(6)
          expect(field.errors.value).toStrictEqual(['50'])
          resolve()
        }

        const field = form.registerField(1, 'name', '', [
          { validationBehavior: vbf, rule }
        ])

        ms.value = 600
        form.validate(1, true)
        ms.value = 100
        form.validate(1, true)
        ms.value = 400
        form.validate(1, true)
        ms.value = 800
        form.validate(1, true)
        ms.value = 200
        form.validate(1, true)
        ms.value = 50
        form.validate(1, true)
      })

    const tests = []

    for (let i = 0; i < 400; i++) {
      tests.push(testFactory())
    }

    await Promise.all(tests)
  })
})
