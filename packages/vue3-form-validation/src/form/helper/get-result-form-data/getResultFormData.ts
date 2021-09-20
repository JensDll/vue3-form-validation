import { isReactive } from 'vue'
import { isTransformedField, deepCopy, set, deepIterator } from '~/common'

export function getResultFormData(transformedFormData: any): any {
  const result = {}

  for (const [, value, , path, isLeaf] of deepIterator(
    transformedFormData,
    isTransformedField
  )) {
    if (isTransformedField(value)) {
      if (isReactive(value.$value)) {
        set(result, path, deepCopy(value.$value))
      } else {
        set(result, path, value.$value)
      }
    } else if (isLeaf) {
      if (isReactive(value)) {
        set(result, path, deepCopy(value))
      } else {
        set(result, path, value)
      }
    }
  }

  return result
}
