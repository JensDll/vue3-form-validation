export const trySet =
  <K, V>(map: Map<K, V>) =>
  ({
    success,
    failure
  }: {
    success?(value: V): void
    failure?(value: V): void
  }) =>
  (key: K, value: V) => {
    const _value = map.get(key)

    if (_value) {
      failure?.(_value)
    } else {
      map.set(key, value)
      success?.(value)
    }
  }
