import { isReactive, ComputedRef, watch } from 'vue'
import { Form } from './Form'
import { Field, TransformedField, RuleInformation } from './types/data'
import { FieldRule } from './types/rules'
import { isTransformedField, isField } from './typeGuards'
import { VALIDATION_CONFIG } from '../validationConfig'
import * as n_domain from '../domain'

export type DisposableMap = Map<number, (() => void)[]>

function mapFieldRules(fieldRules: FieldRule<unknown>[]): RuleInformation[] {
  const defaultValidationBehavior =
    VALIDATION_CONFIG.getDefaultValidationBehavior()

  return fieldRules.map<RuleInformation>(fieldRule => {
    if (typeof fieldRule === 'function') {
      return {
        validationBehavior: defaultValidationBehavior,
        rule: fieldRule
      }
    }

    if (Array.isArray(fieldRule)) {
      const [fieldValidationBehavior, rule, debounce] = fieldRule

      if (typeof fieldValidationBehavior === 'function') {
        return {
          validationBehavior: fieldValidationBehavior,
          rule,
          debounce
        }
      } else {
        const validationBehavior = VALIDATION_CONFIG.validationBehavior.get(
          fieldValidationBehavior
        )
        if (validationBehavior !== undefined) {
          return { validationBehavior, rule, debounce }
        } else {
          console.warn(
            `[useValidation] Validation behavior with name '${fieldValidationBehavior}' does not exist. Valid valuea are`,
            VALIDATION_CONFIG.validationBehavior.keys()
          )
        }
      }
    } else {
      return {
        validationBehavior: defaultValidationBehavior,
        rule: fieldRule
      }
    }

    throw Error('[useValidation] Invalid rule provided')
  })
}

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
  const { $value, $rules, ...fieldExtraProperties } = field
  const rules = $rules ? mapFieldRules($rules) : []
  const uid = n_domain.uid()
  const formField = form.registerField(uid, name, $value, rules)

  const stop = watch(
    formField.modelValue,
    () => {
      formField.dirty = true
      form.validate(uid)
    },
    { deep: true }
  )

  disposables.set(uid, [stop, formField.dispose.bind(formField)])

  return {
    ...fieldExtraProperties,
    $uid: uid,
    $value: formField.modelValue,
    $errors: formField.errors,
    $hasError: formField.hasError,
    $rawErrors: formField.rawErrors,
    $validating: formField.validating,
    $setTouched(touched = true, forceValidate = true) {
      formField.touched = touched
      if (forceValidate) {
        form.validate(uid, forceValidate)
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

export function getResultFormData(
  transformedFormData: any,
  predicate: (value: any) => unknown = () => true
): any {
  const result = {}

  for (const { value, path, isLeaf } of n_domain.deepIterator(
    transformedFormData,
    isTransformedField
  )) {
    if (isLeaf && predicate(value) === true) {
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

export function resetFields(data: any, transformedFormData: any) {
  Object.entries(data).forEach(([key, value]) => {
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
