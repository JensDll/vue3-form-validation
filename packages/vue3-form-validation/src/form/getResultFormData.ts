import { isReactive } from 'vue'
import * as n_domain from '../domain'

export function getResultFormData(transformedFormData: any): any {
  const result = {}

  for (const { value, path, isLeaf } of n_domain.deepIterator(
    transformedFormData,
    n_domain.isTransformedField
  )) {
    if (n_domain.isTransformedField(value)) {
      if (isReactive(value.$value)) {
        // Value is reactive -> value is an object or array
        // Make sure to do a deep clone to loose the reactive reference
        n_domain.set(result, path, n_domain.deepCopy(value.$value))
      } else {
        n_domain.set(result, path, value.$value)
      }
    } else if (isLeaf) {
      if (isReactive(value)) {
        // Same as above
        n_domain.set(result, path, n_domain.deepCopy(value))
      } else {
        n_domain.set(result, path, value)
      }
    }
  }

  return result
}
