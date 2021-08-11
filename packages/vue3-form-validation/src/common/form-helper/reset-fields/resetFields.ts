import { deepCopy } from '../../deep-copy/deep-copy'
import {
  isArray,
  isObject,
  isTransformedField
} from '../../type-guards/typeGuards'

export function resetFields(formData: any, transformedFormData: any) {
  Object.entries(formData).forEach(([key, value]) => {
    const transformedValue = transformedFormData[key]

    if (isTransformedField(transformedValue)) {
      if (isArray(transformedValue.$value)) {
        transformedValue.$value = deepCopy(value)
      } else if (isObject(transformedValue.$value)) {
        const copy = deepCopy(value)
        Object.assign(transformedValue.$value, copy)
      } else {
        transformedValue.$value = value
      }

      return
    }

    if (typeof value === 'object') {
      resetFields(value, transformedFormData[key])
    }
  })
}
