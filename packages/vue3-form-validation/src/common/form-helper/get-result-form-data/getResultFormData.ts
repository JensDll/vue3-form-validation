import { isReactive } from 'vue';
import { deepIterator } from '../../deep-iterator/deepIterator';
import { deepCopy } from '../../deep-copy/deep-copy';
import { set } from '../../set/set';
import { isTransformedField } from '../../type-guards/typeGuards';

export function getResultFormData(transformedFormData: any): any {
  const result = {};

  for (const [, value, , path, isLeaf] of deepIterator(
    transformedFormData,
    isTransformedField
  )) {
    if (isTransformedField(value)) {
      if (isReactive(value.$value)) {
        set(result, path, deepCopy(value.$value));
      } else {
        set(result, path, value.$value);
      }
    } else if (isLeaf) {
      if (isReactive(value)) {
        set(result, path, deepCopy(value));
      } else {
        set(result, path, value);
      }
    }
  }

  return result;
}
