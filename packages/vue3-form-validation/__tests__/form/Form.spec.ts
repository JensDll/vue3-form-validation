import { Tuple } from '../../src/domain'
import {
  Form,
  FormField,
  ValidationBehavior,
  ValidationError
} from '../../src/form'
import { mockFactory } from '../utils'
import { VALIDATION_CONFIG } from '../../src/validationConfig'

let form: Form
let asyncRules: Tuple<jest.Mock, 6>
let syncRules: Tuple<jest.Mock, 6>
let fields: [FormField, FormField, FormField]

function assignFields(validationBehavior: ValidationBehavior) {
  fields = [
    form.registerField(1, 'field_1', '', [
      [validationBehavior, syncRules[0]],
      [validationBehavior, syncRules[1]],
      [validationBehavior, { key: 'a', rule: asyncRules[0] }],
      [validationBehavior, asyncRules[1]]
    ]),
    form.registerField(2, 'field_2', '', [
      [validationBehavior, syncRules[2]],
      [validationBehavior, { key: 'a', rule: asyncRules[2] }],
      [validationBehavior, { key: 'b', rule: asyncRules[3] }],
      [validationBehavior, asyncRules[4]]
    ]),
    form.registerField(3, 'field_3', '', [
      [validationBehavior, syncRules[3]],
      [validationBehavior, syncRules[4]],
      [validationBehavior, syncRules[5]],
      [validationBehavior, { key: 'b', rule: asyncRules[5] }]
    ])
  ]
}

beforeEach(() => {
  form = new Form()
  asyncRules = mockFactory(6, i => i <= 2 && `async[${i}]`, 100, 10)
  syncRules = mockFactory(6, i => i <= 2 && `sync[${i}]`)
})

type EachValidationBehavior = {
  validationBehavior: ValidationBehavior
}

const EACH_VALIDATION_BEHAVIOR: EachValidationBehavior[] = [
  {
    validationBehavior: VALIDATION_CONFIG.validationBehavior.get('aggresive')!
  },
  { validationBehavior: VALIDATION_CONFIG.validationBehavior.get('lazy')! },
  { validationBehavior: VALIDATION_CONFIG.validationBehavior.get('lazier')! }
]

describe.each<EachValidationBehavior>(EACH_VALIDATION_BEHAVIOR)(
  'form.validate ($validationBehavior)',
  ({ validationBehavior }) => {
    beforeEach(() => {
      assignFields(validationBehavior)
    })

    it('should prioritize last rule call', async () => {
      const testFactory = () =>
        new Promise<void>(resolve => {
          const ms = { value: 0 }
          let timeoutCalledTimes = 0

          const callback = () => {
            expect(rule).toHaveBeenCalledTimes(6)
            expect(timeoutCalledTimes).toBe(6)
            expect(field.errors.value).toStrictEqual(['50'])
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

          const field = form.registerField(1, 'name', '', [
            [validationBehavior, rule]
          ])
          field.touched = true

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

      for (let i = 0; i < 1000; i++) {
        tests.push(testFactory())
      }

      await Promise.all(tests)
    })
  }
)

describe.each<EachValidationBehavior>(EACH_VALIDATION_BEHAVIOR)(
  'form.validateAll ($validationBehavior) ',
  ({ validationBehavior }) => {
    beforeEach(() => {
      assignFields(validationBehavior)
    })

    it('should invoke every rule once per call', async () => {
      try {
        await form.validateAll()
        fail('Should throw an error')
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError)
      }

      const allRules = [...syncRules, ...asyncRules]

      for (const rule of allRules) {
        expect(rule).toHaveBeenCalledTimes(1)
      }

      try {
        await form.validateAll()
        fail('Should throw an error')
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError)
      }

      for (const rule of allRules) {
        expect(rule).toHaveBeenCalledTimes(2)
      }

      expect(fields[0].errors.value.sort()).toStrictEqual(
        ['async[0]', 'async[1]', 'sync[0]', 'sync[1]'].sort()
      )
      expect(fields[1].errors.value.sort()).toStrictEqual(
        ['async[2]', 'sync[2]'].sort()
      )
      expect(fields[2].errors.value).toStrictEqual([])
    })
  }
)
