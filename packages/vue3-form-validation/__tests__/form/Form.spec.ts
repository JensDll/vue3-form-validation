import { Form } from '../../src/form'

let form: Form
beforeEach(() => {
  form = new Form()
})

describe('form.validate', () => {
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

        const field = form.registerField(1, 'name', '', 'aggresive', [rule])

        ms.value = 600
        form.validate(1)
        ms.value = 100
        form.validate(1)
        ms.value = 400
        form.validate(1)
        ms.value = 800
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
