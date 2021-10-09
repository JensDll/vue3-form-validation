import { watch } from 'vue'
import { Field, TransformedField } from '../composition'
import { Form } from './Form'
import * as n_domain from '../domain'

export type DisposableMap = Map<number, (() => void)[]>

function registerField(
  form: Form,
  name: string,
  field: Field<unknown>,
  disposables: DisposableMap
): { [K in keyof TransformedField<unknown>]: unknown } {
  const uid = n_domain.uid()
  const formField = form.registerField(
    uid,
    name,
    field.$value,
    field.$validationBehavior || 'lazier',
    field.$rules ?? []
  )

  const stop = watch(
    formField.modelValue,
    () => {
      form.validate(uid)
    },
    { deep: true }
  )

  disposables.set(uid, [stop, formField.dispose.bind(formField)])

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

export function transformFormData(form: Form, formData: object) {
  const disposables: DisposableMap = new Map()

  for (const { key, value, parent } of n_domain.deepIterator(formData)) {
    if (n_domain.isField(value)) {
      const transformedField = registerField(form, key, value, disposables)
      parent[key] = transformedField
    }
  }

  return disposables
}
