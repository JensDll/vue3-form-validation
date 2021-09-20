import { deepIterator } from '../deep-iterator/deepIterator'
import { set } from '../set/set'
import { isArray } from '../type-guards/typeGuards'

export function deepCopy<T>(toClone: T): T {
  if (typeof toClone === 'object') {
    const copy = isArray(toClone) ? [] : {}

    for (const [, value, , path, isLeaf] of deepIterator(toClone as any)) {
      if (isLeaf) {
        set(copy, path, value)
      }
    }

    return copy as T
  }

  return toClone
}
