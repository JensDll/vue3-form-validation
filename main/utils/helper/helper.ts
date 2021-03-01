import { isReactive, watch } from 'vue';
import { Field, TransformedField } from '../../composition/useValidation';
import useUid from '../../composition/useUid';
import Form from '../../Form';

const isField = <T>(field: any): field is Field<T> =>
  typeof field === 'object' ? '$value' in field : false;

const isTransformedField = <T>(field: any): field is TransformedField<T> =>
  typeof field === 'object'
    ? '$uid' in field &&
      '$value' in field &&
      '$errors' in field &&
      '$validating' in field
    : false;

export function transformFormData(form: Form, formData: any) {
  Object.entries(formData).forEach(([key, value]) => {
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

      formData[key] = {
        $uid: uid,
        $value: formField.modelValue,
        $errors: formField.getErrors(),
        $validating: formField.validating(),
        async $onBlur() {
          if (!formField.touched) {
            formField.touched = true;
            await form.validate(uid);
          }
        }
      };

      return;
    }

    if (typeof value === 'object') {
      transformFormData(form, value);
    }
  });
}

export function resetFields(transformedFormData: any, formData: any) {
  Object.entries(transformedFormData).forEach(([key, value]) => {
    if (isTransformedField(value)) {
      if (isReactive(value.$value) && !Array.isArray(value.$value)) {
        Object.assign(value.$value, formData[key]);
      } else {
        value.$value = formData[key];
      }

      return;
    }

    if (typeof value === 'object') {
      resetFields(value, formData[key]);
    }
  });
}

export function cleanupForm(form: Form, formData: any) {
  Object.values(formData).forEach(value => {
    if (isTransformedField(value)) {
      form.onDelete(value.$uid);
      return;
    }

    if (typeof value === 'object') {
      cleanupForm(form, value);
    }
  });
}

export function getResultFormData(formData: any, resultFormData: any) {
  Object.entries(formData).forEach(([key, value]) => {
    if (isTransformedField(value)) {
      resultFormData[key] =
        typeof value.$value === 'object'
          ? JSON.parse(JSON.stringify(value.$value))
          : value.$value;
      return;
    }

    if (typeof value == 'object') {
      resultFormData[key] = {};
    } else {
      resultFormData[key] = value;
      return;
    }

    if (Array.isArray(value)) {
      resultFormData[key] = [];
    }

    getResultFormData(value, resultFormData[key]);
  });
}
