export function path(
  path: readonly any[],
  o: Record<string | number, unknown>
) {
  let value = o[path[0]] as any

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
