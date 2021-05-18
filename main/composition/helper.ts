import { isReactive, watch } from 'vue';
import { deepIterator } from '../common';
import { deepAssign } from '../common/deep-assign/deepAssign';
import { Form } from '../form/Form';
import { useUid } from './useUid';
import { Field, TransformedField } from './useValidation';

const isField = <T>(field: any): field is Field<T> =>
  typeof field === 'object' && field !== null ? '$value' in field : false;

const isTransformedField = <T>(field: any): field is TransformedField<T> =>
  typeof field === 'object' && field !== null
    ? '$uid' in field &&
      '$value' in field &&
      '$errors' in field &&
      '$validating' in field
    : false;

export function transformFormData(form: Form, formData: any) {
  for (const [key, value, parent] of deepIterator(formData)) {
    if (isField(value)) {
      const uid = useUid();
      const formField = form.registerField(
        uid,
        value.$rules ?? [],
        value.$value
      );

      watch(formField.modelValue, () => {
        if (formField.touched) {
          form.validate(uid);
        }
      });

      parent[key] = {
        $uid: uid,
        $value: formField.modelValue,
        $errors: formField.getErrors(),
        $hasError: formField.hasError(),
        $validating: formField.validating,
        async $onBlur() {
          if (!formField.touched) {
            formField.touched = true;
            await form.validate(uid);
          }
        }
      } as { [K in keyof TransformedField<any>]: unknown };
    }
  }
}

export function resetFields(formData: any, transformedFormData: any) {
  Object.entries(formData).forEach(([key, value]) => {
    const transformedValue = transformedFormData[key];

    if (isTransformedField(transformedValue)) {
      if (isReactive(transformedValue.$value)) {
        deepAssign(transformedValue.$value, value);
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

export function cleanupForm(form: Form, transformedFormData: any) {
  for (const [, value] of deepIterator(
    transformedFormData,
    isTransformedField
  )) {
    if (isTransformedField(value)) {
      form.onDelete(value.$uid);
    }
  }
}

export function getResultFormData(transformedFormData: any) {
  const result = {};

  getResultFormDataImpl(transformedFormData, result);

  return result;
}

function getResultFormDataImpl(transformedFormData: any, result: any) {
  Object.entries(transformedFormData).forEach(([key, value]) => {
    if (isTransformedField(value)) {
      if (typeof value.$value === 'object' && value.$value !== null) {
        if (Array.isArray(value.$value)) {
          result[key] = deepAssign([], value.$value);
        } else {
          result[key] = deepAssign({}, value.$value);
        }
      } else {
        result[key] = value.$value;
      }

      return;
    }

    if (typeof value == 'object' && value !== null) {
      result[key] = {};
      if (Array.isArray(value)) {
        result[key] = [];
      }
    } else {
      result[key] = value;
      return;
    }

    getResultFormDataImpl(value, result[key]);
  });
}
