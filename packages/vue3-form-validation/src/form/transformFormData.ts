import { watch } from 'vue'
import { Field, TransformedField } from '../composition'
import { Form } from './Form'
import * as n_domain from '../domain'

function registerField(
  form: Form,
  name: string,
  field: Field<unknown>
): { [K in keyof TransformedField<unknown>]: unknown } {
  const uid = n_domain.uid()
  const formField = form.registerField(
    uid,
    name,
    field.$value,
    field.$validationBehavior || 'lazier',
    field.$rules ?? []
  )

  watch(
    formField.modelValue,
    () => {
      form.validate(uid)
    },
    { deep: true }
  )

  return {
    $uid: uid,
    $value: formField.modelValue,
    $errors: formField.errors,
    $hasError: formField.hasError,
    $validating: formField.validating,
    async $setTouched() {
      formField.touched = true
      await form.validate(uid, true)
    }
  }
}

export function transformFormData(form: Form, formData: object): void {
  for (const [key, value, parent] of n_domain.deepIterator(formData)) {
    if (n_domain.isField(value)) {
      const transformedField = registerField(form, key, value)
      parent[key] = transformedField
    }
  }
}
