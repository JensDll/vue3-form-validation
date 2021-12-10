import { Key } from './types'

export function path(path: readonly Key[], obj: Record<Key, unknown>): any {
  let value: any = obj[path[0]]

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
