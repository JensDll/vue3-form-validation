import { deepIterator } from '../deep-iterator/deepIterator';
import { set } from '../set/set';

export function deepAssign<T>(target: T, ...sources: any[]) {
  for (const source of sources) {
    for (const [, value, , path, isLeaf] of deepIterator(source)) {
      if (isLeaf) {
        set(target, path, value);
      }
    }
  }

  return target;
}
