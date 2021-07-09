import { deepIterator } from '../deep-iterator/deepIterator';
import { set } from '../set/set';
import { isArray } from '../type-guards/typeGuards';

export function deepCopy(value: any) {
  if (typeof value === 'object') {
    return deepCopyImpl(value);
  }
  return value;
}

function deepCopyImpl(obj: any) {
  const copy = isArray(obj) ? [] : {};

  for (const [, value, , path, isLeaf] of deepIterator(obj)) {
    if (isLeaf) {
      if (value instanceof File) {
        set(copy, path, new File([value], value.name, { type: value.type }));
      } else {
        set(copy, path, value);
      }
    }
  }

  return copy;
}
