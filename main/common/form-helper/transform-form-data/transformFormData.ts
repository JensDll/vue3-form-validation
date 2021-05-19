import { watch } from 'vue';
import { useUid } from '../../../composition/useUid';
import { TransformedField } from '../../../composition/useValidation';
import { Form } from '../../../form/Form';
import { deepIterator } from '../../deep-iterator/deepIterator';
import { isField } from '../../type-guards/typeGuards';

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
