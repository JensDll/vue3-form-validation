export const ValidationConfig = jest.fn<any, any>().mockImplementation(() => {
  const { ValidationConfig } = jest.requireActual('../ValidationConfig')

  class MockValidationConfig extends ValidationConfig {
    constructor() {
      super()
      this.validationBehavior.set('lazy', () => true)
    }
  }

  return new MockValidationConfig()
})

export const VALIDATION_CONFIG = new ValidationConfig()
