import { deepIterator } from './deepIterator'
import { set } from './set'
import { isObject, isArray } from './typeGuards'

export function deepCopy<T>(toClone: T): T {
  if (isObject(toClone)) {
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
