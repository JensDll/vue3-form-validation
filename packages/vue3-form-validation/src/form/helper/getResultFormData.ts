import { isReactive } from 'vue'
import * as _ from '../../common'

export function getResultFormData(transformedFormData: any): any {
  const result = {}

  for (const [, value, , path, isLeaf] of _.deepIterator(
    transformedFormData,
    _.isTransformedField
  )) {
    if (_.isTransformedField(value)) {
      if (isReactive(value.$value)) {
        // Value is reactive -> value is an object or array
        // Make sure to do a deep clone to loose the reactive reference
        _.set(result, path, _.deepCopy(value.$value))
      } else {
        _.set(result, path, value.$value)
      }
    } else if (isLeaf) {
      if (isReactive(value)) {
        // Same as above
        _.set(result, path, _.deepCopy(value))
      } else {
        _.set(result, path, value)
      }
    }
  }

  return result
}
