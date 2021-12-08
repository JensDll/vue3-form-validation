export const Form = jest.fn<any, any>().mockImplementation(() => {
  const { Form } = jest.requireActual('../Form')

  class MockForm extends Form {
    dispose = jest.fn(uid => super.dispose(uid))

    validate = jest.fn(uid => super.validate(uid))

    registerField = jest.fn((uid, name, modelValue, ruleInfos) =>
      super.registerField(uid, name, modelValue, ruleInfos)
    )

    getField = jest.fn(uid => super.getField(uid))
  }

  return new MockForm()
})
