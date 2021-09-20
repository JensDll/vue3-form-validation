import { watch } from 'vue'
import { useUid } from '../../../composition/useUid'
import { Field, TransformedField } from '../../../composition/useValidation'
import { Form } from '~/form'
import { deepIterator, isField } from '~/common'

function registerField(
  form: Form,
  name: string,
  field: Field<unknown>
): { [K in keyof TransformedField<any>]: any } {
  const uid = useUid()
  const formField = form.registerField(
    uid,
    name,
    field.$value,
    field.$rules ?? []
  )

  watch(
    formField.modelValue,
    () => {
      if (formField.touched) {
        form.validate(uid)
      }
    },
    { deep: true }
  )

  return {
    $uid: uid,
    $value: formField.modelValue,
    $errors: formField.errors,
    $hasError: formField.hasError,
    $validating: formField.validating,
    async $onBlur() {
      if (!formField.touched) {
        formField.touched = true
        await form.validate(uid)
      }
    }
  }
}

export function transformFormData(form: Form, data: object): void {
  for (const [key, value, parent] of deepIterator(data)) {
    if (isField(value)) {
      const transformedField = registerField(form, key, value)
      parent[key] = transformedField
    }
  }
}
