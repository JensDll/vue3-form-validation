import { Key, Keys } from '../types'

export function path(path: Keys, obj: Record<Key, unknown>) {
  let value = obj[path[0]] as any

  for (let i = 0; i < path.length; i++) {
    const key = path[i]

    if (value === null || value === undefined) {
      return undefined
    }

    if (i > 0) {
      value = value[key]
    }
  }

  return value
}
