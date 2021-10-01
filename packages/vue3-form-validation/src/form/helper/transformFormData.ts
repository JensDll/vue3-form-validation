import { watch } from 'vue'
import { Field, TransformedField } from '../../composition/useValidation'
import { Form } from '../entities'
import * as _ from '../../common'

function registerField(
  form: Form,
  name: string,
  field: Field<unknown>
): { [K in keyof TransformedField<any>]: any } {
  const uid = _.uid()
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
    async $setTouched() {
      if (!formField.touched) {
        formField.touched = true
        await form.validate(uid)
      }
    }
  }
}

export function transformFormData(form: Form, data: object): void {
  for (const [key, value, parent] of _.deepIterator(data)) {
    if (_.isField(value)) {
      const transformedField = registerField(form, key, value)
      parent[key] = transformedField
    }
  }
}
