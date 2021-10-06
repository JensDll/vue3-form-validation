import { ref } from 'vue'
import { Form, FormField, ValidationError } from '../../src/form'
import { promiseFactory } from '../utils'

let form: Form
let s1: jest.Mock
let s2: jest.Mock
let s3: jest.Mock
let s4: jest.Mock
let s5: jest.Mock
let s6: jest.Mock
let s7: jest.Mock
let as1: jest.Mock
let as2: jest.Mock
let as3: jest.Mock
let as4: jest.Mock
let as5: jest.Mock

beforeEach(() => {
  form = new Form()
  s1 = jest.fn(x => x)
  s2 = jest.fn(x => x)
  s3 = jest.fn(x => x)
  s4 = jest.fn(x => x)
  s5 = jest.fn(x => x)
  s6 = jest.fn(x => x)
  s7 = jest.fn(x => x)
  as1 = jest.fn(() => promiseFactory('as1', 200))
  as2 = jest.fn(() => promiseFactory('as2', 400))
  as3 = jest.fn(() => promiseFactory('as3', 600))
  as4 = jest.fn(() => promiseFactory('as4', 800))
  as5 = jest.fn(() => promiseFactory('as5', 1000))
})

describe('validate simple rules', () => {
  it("shouln't call rules when form field isn't touched", async () => {
    form.registerField(1, 'name', '', 'lazy', [s1, s2])

    await form.validate(1)

    expect(s1).toHaveBeenCalledTimes(0)
    expect(s2).toHaveBeenCalledTimes(0)
  })

  it('should call all rules once with correct values', async () => {
    const field = form.registerField(1, 'name', '', 'lazy', [s1, s2])
    field.touched = true
    field.modelValue = ref('foo')

    await form.validate(1)

    field.modelValue = ref('bar')

    await form.validate(1)

    expect(s1).toHaveBeenCalledTimes(2)
    expect(s2).toHaveBeenCalledTimes(2)

    expect(s1).nthCalledWith(1, 'foo')
    expect(s1).nthCalledWith(2, 'bar')

    expect(s2).nthCalledWith(1, 'foo')
    expect(s2).nthCalledWith(2, 'bar')
  })
})

describe('validate keyed rules', () => {
  let ff1: FormField
  let ff2: FormField

  beforeEach(() => {
    ff1 = form.registerField(1, 'name', '', 'lazy', [
      { key: 'a', rule: s1 },
      { key: 'b', rule: s2 }
    ])
    ff2 = form.registerField(2, 'name', '', 'lazy', [{ key: 'a', rule: s3 }])
  })

  it('should not call any rule when atleast one field is not touched', async () => {
    ff1.modelValue = ref('ff1')
    ff1.touched = true
    ff2.modelValue = ref('ff2')

    await form.validate(1)

    expect(s1).toHaveBeenCalledTimes(0)
    expect(s2).toHaveBeenCalledTimes(1)
    expect(s3).toHaveBeenCalledTimes(0)

    expect(s2).nthCalledWith(1, 'ff1')

    await form.validate(2)

    expect(s1).toHaveBeenCalledTimes(0)
    expect(s2).toHaveBeenCalledTimes(1)
    expect(s3).toHaveBeenCalledTimes(0)

    ff2.touched = true

    await form.validate(1)

    expect(s1).toHaveBeenCalledTimes(1)
    expect(s2).toHaveBeenCalledTimes(2)
    expect(s3).toHaveBeenCalledTimes(1)

    expect(s1).nthCalledWith(1, 'ff1', 'ff2')
    expect(s2).nthCalledWith(2, 'ff1')
    expect(s3).nthCalledWith(1, 'ff1', 'ff2')

    await form.validate(2)

    expect(s1).toHaveBeenCalledTimes(2)
    expect(s2).toHaveBeenCalledTimes(2)
    expect(s3).toHaveBeenCalledTimes(2)

    expect(s1).nthCalledWith(2, 'ff1', 'ff2')
    expect(s3).nthCalledWith(2, 'ff1', 'ff2')
  })
})

describe('complex examples', () => {
  let ff1: FormField
  let ff2: FormField
  let ff3: FormField

  beforeEach(() => {
    ff1 = form.registerField(1, 'name', null, 'lazy', [
      s1,
      { key: 'a', rule: s2 }
    ])

    ff2 = form.registerField(2, 'name', null, 'lazy', [{ key: 'a', rule: s3 }])

    ff3 = form.registerField(3, 'name', null, 'lazy', [
      s4,
      s5,
      { key: 'a', rule: s6 },
      { key: 'b', rule: s7 }
    ])
  })

  it('should always call simple rules but not always keyed rules', async () => {
    ff1.touched = true

    await form.validate(1)

    expect(s1).toHaveBeenCalledTimes(1)
    expect(s2).toHaveBeenCalledTimes(0)
    expect(s3).toHaveBeenCalledTimes(0)
    expect(s4).toHaveBeenCalledTimes(0)
    expect(s5).toHaveBeenCalledTimes(0)
    expect(s6).toHaveBeenCalledTimes(0)
    expect(s7).toHaveBeenCalledTimes(0)

    ff3.touched = true

    await form.validate(3)

    expect(s1).toHaveBeenCalledTimes(1)
    expect(s2).toHaveBeenCalledTimes(0)
    expect(s3).toHaveBeenCalledTimes(0)
    expect(s4).toHaveBeenCalledTimes(1)
    expect(s5).toHaveBeenCalledTimes(1)
    expect(s6).toHaveBeenCalledTimes(0)
    expect(s7).toHaveBeenCalledTimes(1)

    ff2.touched = true

    await form.validate(3)

    expect(s1).toHaveBeenCalledTimes(1)
    expect(s2).toHaveBeenCalledTimes(1)
    expect(s3).toHaveBeenCalledTimes(1)
    expect(s4).toHaveBeenCalledTimes(2)
    expect(s5).toHaveBeenCalledTimes(2)
    expect(s6).toHaveBeenCalledTimes(1)
    expect(s7).toHaveBeenCalledTimes(2)

    await form.validate(2)

    expect(s1).toHaveBeenCalledTimes(1)
    expect(s2).toHaveBeenCalledTimes(2)
    expect(s3).toHaveBeenCalledTimes(2)
    expect(s4).toHaveBeenCalledTimes(2)
    expect(s5).toHaveBeenCalledTimes(2)
    expect(s6).toHaveBeenCalledTimes(2)
    expect(s7).toHaveBeenCalledTimes(2)

    await form.validate(1)

    expect(s1).toHaveBeenCalledTimes(2)
    expect(s2).toHaveBeenCalledTimes(3)
    expect(s3).toHaveBeenCalledTimes(3)
    expect(s4).toHaveBeenCalledTimes(2)
    expect(s5).toHaveBeenCalledTimes(2)
    expect(s6).toHaveBeenCalledTimes(3)
    expect(s7).toHaveBeenCalledTimes(2)
  })

  it('validate all should call all rules and set fields touched', async () => {
    expect(ff1.touched).toBe(false)
    expect(ff2.touched).toBe(false)
    expect(ff3.touched).toBe(false)

    await form.validateAll()

    expect(ff1.touched).toBe(true)
    expect(ff2.touched).toBe(true)
    expect(ff3.touched).toBe(true)

    expect(s1).toHaveBeenCalledTimes(1)
    expect(s2).toHaveBeenCalledTimes(1)
    expect(s3).toHaveBeenCalledTimes(1)
    expect(s4).toHaveBeenCalledTimes(1)
    expect(s5).toHaveBeenCalledTimes(1)
    expect(s6).toHaveBeenCalledTimes(1)
    expect(s7).toHaveBeenCalledTimes(1)

    ff1.modelValue = ref('foo')

    try {
      await form.validateAll()
      fail('Should throw')
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError)
    }

    expect(s1).toHaveBeenCalledTimes(2)
    expect(s2).toHaveBeenCalledTimes(2)
    expect(s3).toHaveBeenCalledTimes(2)
    expect(s4).toHaveBeenCalledTimes(2)
    expect(s5).toHaveBeenCalledTimes(2)
    expect(s6).toHaveBeenCalledTimes(2)
    expect(s7).toHaveBeenCalledTimes(2)

    ff1.modelValue = ref(undefined)
    await form.validateAll()

    expect(s1).toHaveBeenCalledTimes(3)
    expect(s2).toHaveBeenCalledTimes(3)
    expect(s3).toHaveBeenCalledTimes(3)
    expect(s4).toHaveBeenCalledTimes(3)
    expect(s5).toHaveBeenCalledTimes(3)
    expect(s6).toHaveBeenCalledTimes(3)
    expect(s7).toHaveBeenCalledTimes(3)
  })
})

describe('async validation', () => {
  let ff1: FormField
  let ff2: FormField
  let ff3: FormField

  beforeEach(() => {
    ff1 = form.registerField(1, 'name', '', 'lazy', [as1, as2])
    ff2 = form.registerField(2, 'name', '', 'lazy', [{ key: 'a', rule: as3 }])
    ff3 = form.registerField(3, 'name', '', 'lazy', [
      as4,
      { key: 'a', rule: as5 }
    ])
  })

  it('validate all should wait for all rules to resolve', async () => {
    ff1.modelValue = ref('ff1')
    ff2.modelValue = ref('ff2')
    ff3.modelValue = ref('ff3')

    try {
      await form.validateAll()
      fail('Should throw')
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError)
    }

    expect(as1).toHaveBeenCalledTimes(1)
    expect(as2).toHaveBeenCalledTimes(1)
    expect(as3).toHaveBeenCalledTimes(1)
    expect(as4).toHaveBeenCalledTimes(1)
    expect(as5).toHaveBeenCalledTimes(1)

    expect(as1).toHaveBeenCalledWith('ff1')
    expect(as2).toHaveBeenCalledWith('ff1')
    expect(as3).toHaveBeenCalledWith('ff2', 'ff3')
    expect(as4).toHaveBeenCalledWith('ff3')
    expect(as5).toHaveBeenCalledWith('ff2', 'ff3')

    expect(form.errors.value.sort()).toStrictEqual(
      ['as1', 'as2', 'as3', 'as4', 'as5'].sort()
    )
  })

  it('should not set errors after resetting form', done => {
    form.validateAll().then(() => {
      expect(form.errors.value).toStrictEqual([])
      done()
    })
    form.resetFields(true)
  })

  it('should prioritize last rule call', async () => {
    const testFactory = () =>
      new Promise<void>(resolve => {
        const form = new Form()
        const ms = { value: 0 }
        let timeoutCalledTimes = 0

        const callback = () => {
          expect(rule).toHaveBeenCalledTimes(6)
          expect(timeoutCalledTimes).toBe(6)
          expect(formField.errors.value).toStrictEqual(['50'])
          resolve()
        }

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

        const formField = form.registerField(1, 'name', '', 'lazy', [rule])
        formField.touched = true

        ms.value = 1000
        form.validate(1)
        ms.value = 100
        form.validate(1)
        ms.value = 800
        form.validate(1)
        ms.value = 1200
        form.validate(1)
        ms.value = 200
        form.validate(1)
        ms.value = 50
        form.validate(1)
      })

    const tests = []

    for (let i = 0; i < 1000; i++) {
      tests.push(testFactory())
    }

    await Promise.all(tests)
  })
})
