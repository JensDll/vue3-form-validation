export function set(obj: any, keys: readonly (string | number)[], value: any) {
  if (keys.length === 0) {
    return
  }

  let o = obj as Record<string, unknown>
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    const nextKey = keys[i + 1]
    const value = o[key]

    if (value === undefined) {
      if (Number.isNaN(+nextKey)) {
        o[key] = {}
      } else {
        o[key] = []
      }
    }

    o = o[key] as any
  }

  o[keys[keys.length - 1]] = value
}
