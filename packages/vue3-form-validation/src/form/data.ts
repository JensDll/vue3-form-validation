import { isReactive, ComputedRef, watch } from 'vue'
import { Form } from './Form'
import { Field, TransformedField } from './types/data'
import { ValidationBehaviorRuleTupel } from './types/validationBehavior'
import { isTransformedField, isField } from './typeGuards'
import { CONFIG } from '../config'
import * as n_domain from '../domain'

export type DisposableMap = Map<number, (() => void)[]>

function registerField(
  form: Form,
  name: string,
  field: Field<unknown>,
  disposables: DisposableMap
): {
  [K in keyof TransformedField<unknown>]:
    | TransformedField<unknown>[K]
    | ComputedRef<TransformedField<unknown>[K]>
} {
  const defaultValidationBehavior = CONFIG.getDefaultValidationBehavior()
  const rules =
    field.$rules?.map<ValidationBehaviorRuleTupel>(fieldRule => {
      if (typeof fieldRule === 'function') {
        return [defaultValidationBehavior, fieldRule]
      }

      if (Array.isArray(fieldRule)) {
        const [fieldValidationBehavior, rule] = fieldRule

        if (typeof fieldValidationBehavior === 'function') {
          return [fieldValidationBehavior, rule]
        } else {
          const validationBehavior = CONFIG.validationBehavior.get(
            fieldValidationBehavior
          )
          if (validationBehavior !== undefined) {
            return [validationBehavior, rule]
          }
        }
      } else {
        return [defaultValidationBehavior, fieldRule]
      }

      throw Error('Invalid rule provided')
    }) ?? []

  const uid = n_domain.uid()
  const formField = form.registerField(uid, name, field.$value, rules)

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
    async $setTouched(forceValidation = true) {
      formField.touched = true
      if (forceValidation) {
        await form.validate(uid, forceValidation)
      }
    }
  }
}

export function transformFormData(form: Form, formData: object) {
  const disposables: DisposableMap = new Map()

  for (const { key, value, parent } of n_domain.deepIterator(formData)) {
    if (isField(value)) {
      const transformedField = registerField(form, key, value, disposables)
      parent[key] = transformedField
    }
  }

  return disposables
}

export function getResultFormData(transformedFormData: any): any {
  const result = {}

  for (const { value, path, isLeaf } of n_domain.deepIterator(
    transformedFormData,
    isTransformedField
  )) {
    if (isLeaf) {
      const unpackedValue = isTransformedField(value) ? value.$value : value
      // Value is reactive -> value is an object or array
      // Make sure to do a deep clone to loose the reactive reference
      if (isReactive(unpackedValue)) {
        n_domain.set(result, path, n_domain.deepCopy(unpackedValue))
      } else {
        n_domain.set(result, path, unpackedValue)
      }
    }
  }

  return result
}

export function cleanupForm(
  form: Form,
  deletedFormData: any,
  disposables: DisposableMap
) {
  const dispose = n_domain.tryGet(disposables)({
    success: fs => fs.forEach(f => f())
  })

  if (isTransformedField(deletedFormData)) {
    dispose(deletedFormData.$uid)
    form.onDelete(deletedFormData.$uid)
    disposables.delete(deletedFormData.$uid)
    return
  }

  for (const { value } of n_domain.deepIterator(
    deletedFormData,
    isTransformedField
  )) {
    if (isTransformedField(value)) {
      dispose(value.$uid)
      form.onDelete(value.$uid)
      disposables.delete(value.$uid)
    }
  }
}

export function resetFields(formData: any, transformedFormData: any) {
  Object.entries(formData).forEach(([key, value]) => {
    const transformedValue = transformedFormData[key]

    if (isTransformedField(transformedValue)) {
      if (n_domain.isArray(transformedValue.$value)) {
        transformedValue.$value = n_domain.deepCopy(value)
      } else if (n_domain.isRecord(transformedValue.$value)) {
        const copy = n_domain.deepCopy(value)
        Object.assign(transformedValue.$value, copy)
      } else {
        transformedValue.$value = value
      }

      return
    }

    if (n_domain.isObject(value)) {
      resetFields(value, transformedFormData[key])
    }
  })
}
