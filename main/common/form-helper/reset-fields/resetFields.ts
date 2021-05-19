import { deepAssign } from '../../deep-assign/deepAssign';
import {
  isArray,
  isObject,
  isTransformedField
} from '../../type-guards/typeGuards';

export function resetFields(formData: any, transformedFormData: any) {
  Object.entries(formData).forEach(([key, value]) => {
    const transformedValue = transformedFormData[key];

    if (isTransformedField(transformedValue)) {
      if (isArray(transformedValue.$value)) {
        transformedValue.$value = deepAssign([], value);
      } else if (isObject(transformedValue.$value)) {
        Object.assign(transformedValue.$value, deepAssign({}, value));
      } else {
        transformedValue.$value = value;
      }

      return;
    }

    if (typeof value === 'object') {
      resetFields(value, transformedFormData[key]);
    }
  });
}
