import { deepAssign } from '../../deep-assign/deepAssign';
import { deepIterator } from '../../deep-iterator/deepIterator';
import { set } from '../../set/set';
import {
  isArray,
  isObject,
  isTransformedField
} from '../../type-guards/typeGuards';

export function getResultFormData(transformedFormData: any) {
  const result = {};

  for (const [, value, , path, isLeaf] of deepIterator(
    transformedFormData,
    isTransformedField
  )) {
    if (isTransformedField(value)) {
      if (isArray(value.$value)) {
        set(result, path, deepAssign([], value.$value));
      } else if (isObject(value.$value)) {
        set(result, path, deepAssign({}, value.$value));
      } else {
        set(result, path, value.$value);
      }
    } else if (isLeaf) {
      set(result, path, value);
    }
  }

  return result;
}
