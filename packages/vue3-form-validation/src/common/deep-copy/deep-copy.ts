import { deepIterator } from '../deep-iterator/deepIterator';
import { set } from '../set/set';
import { isArray } from '../type-guards/typeGuards';

export function deepCopy(toClone: any) {
  if (typeof toClone !== 'object') {
    return toClone;
  }

  const copy = isArray(toClone) ? [] : {};

  for (const [, value, , path, isLeaf] of deepIterator(toClone)) {
    if (isLeaf) {
      set(copy, path, value);
    }
  }

  return copy;
}
