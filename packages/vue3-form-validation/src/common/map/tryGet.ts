export const tryGet = <K, V>(map: Map<K, V>) => ({
  success,
  failure
}: {
  success(value: V): void;
  failure?(): void;
}) => (key: K) => {
  const value = map.get(key);

  if (value) {
    success(value);
  } else {
    failure?.();
  }
};
