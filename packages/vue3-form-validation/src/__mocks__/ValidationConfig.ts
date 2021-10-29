import {
  ValidationBehaviorFunction,
  ValidationBehaviorInfo,
  ValidationBehaviorString
} from '../form'
import { ValidationConfig as RealValidationConfig } from '../ValidationConfig'

export const mockAggressive = jest.fn<any, ValidationBehaviorInfo<any>[]>(
  () => true
)
export const mockLazy = jest.fn<any, ValidationBehaviorInfo<any>[]>(
  ({ touched }) => touched
)
export const mockLazier = jest.fn<any, ValidationBehaviorInfo<any>[]>(
  ({ force, touched, submit, hasError }) =>
    force || submit || (touched && hasError)
)
export const mockSubmit = jest.fn<any, ValidationBehaviorInfo<any>[]>(
  ({ submit, hasError }) => submit || hasError
)

export const ValidationConfig = jest
  .fn<RealValidationConfig, any>()
  .mockImplementation(() => {
    class MockValidationConfig {
      defaultValidationBehavior: ValidationBehaviorString
      validationBehavior: Map<
        ValidationBehaviorString,
        ValidationBehaviorFunction
      >

      constructor() {
        this.defaultValidationBehavior = 'lazier'
        this.validationBehavior = new Map([
          ['aggressive', mockAggressive],
          ['lazy', mockLazy],
          ['lazier', mockLazier],
          ['submit', mockSubmit]
        ])
      }

      getDefaultValidationBehavior() {
        return this.validationBehavior.get(this.defaultValidationBehavior)!
      }
    }

    return new MockValidationConfig()
  })
