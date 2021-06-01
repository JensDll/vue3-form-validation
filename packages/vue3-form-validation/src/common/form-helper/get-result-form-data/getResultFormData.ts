import { isReactive } from 'vue';
import { deepIterator } from '../../deep-iterator/deepIterator';
import { jsonCopy } from '../../json-copy/jsonCopy';
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
        set(result, path, jsonCopy(value.$value));
      } else {
        set(result, path, value.$value);
      }
    } else if (isLeaf) {
      set(result, path, value);
    }
  }

  return result;
}
