import { deepIterator } from '../deep-iterator/deepIterator';
import { set } from '../set/set';
import { isArray } from '../type-guards/typeGuards';

export function deepCopy(value: any) {
  return deepCopyImpl(value);
}

function deepCopyImpl(toClone: any) {
  if (typeof toClone !== 'object') {
    return toClone;
  }

  const copy = isArray(toClone) ? [] : {};

  for (const [, value, , path, isLeaf] of deepIterator(toClone)) {
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
