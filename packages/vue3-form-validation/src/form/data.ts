import { ComputedRef, Ref, UnwrapRef, unref } from 'vue'

import { Form } from './Form'
import { FieldRule, RuleInformation } from './rules'
import { VALIDATION_CONFIG } from '../ValidationConfig'
import * as nDomain from '../domain'

export const isField = <T>(x: unknown): x is Field<T> =>
  nDomain.isRecord(x) ? '$value' in x : false

export const isTransformedField = <T>(x: unknown): x is TransformedField<T> =>
  nDomain.isRecord(x) ? '$uid' in x && '$value' in x : false

export function mapFieldRules(
  fieldRules: FieldRule<unknown>[]
): RuleInformation[] {
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
      const [first, second, third] = fieldRule

      if (typeof second === 'number') {
        return {
          validationBehavior: defaultValidationBehavior,
          rule: first as any,
          debounce: second
        }
      }

      if (typeof first === 'function') {
        return {
          validationBehavior: first,
          rule: second,
          debounce: third
        }
      }

      const validationBehavior = VALIDATION_CONFIG.validationBehavior.get(
        first as any
      )

      if (validationBehavior !== undefined) {
        return { validationBehavior, rule: second, debounce: third }
      } else {
        console.error(
          `[useValidation] Validation behavior with name '${first}' does not exist. Valid values are`,
          VALIDATION_CONFIG.validationBehavior.keys()
        )
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

export function registerField(
  form: Form,
  name: string,
  field: Field<unknown>
): {
  [K in keyof TransformedField<unknown>]:
    | TransformedField<unknown>[K]
    | ComputedRef<TransformedField<unknown>[K]>
    | Ref<TransformedField<unknown>[K]>
} {
  const { $value, $rules, ...fieldExtraProperties } = field
  const rules = $rules ? mapFieldRules($rules) : []
  const uid = nDomain.uid()
  const formField = form.registerField(uid, name, $value, rules)

  return {
    ...fieldExtraProperties,
    $uid: uid,
    $value: formField.modelValue,
    $errors: formField.errors,
    $hasError: formField.hasError,
    $rawErrors: formField.rawErrors,
    $validating: formField.validating,
    $dirty: formField.dirty,
    $touched: formField.touched,
    $validate({ setTouched, force } = {}) {
      setTouched ??= true
      force ??= true

      if (setTouched) {
        formField.touched.value = true
      }

      form.validate(uid, force)
    }
  }
}

export function transformFormData(form: Form, formData: object) {
  for (const { key, value, parent } of nDomain.deepIterator(formData)) {
    if (isField(value)) {
      const transformedField = registerField(form, key, value)
      parent[key] = transformedField
    }
  }
}

export function getResultFormData(
  transformedFormData: any,
  predicate: (
    value: Omit<nDomain.DeepIteratorResult, 'isLeaf' | 'parent'>
  ) => unknown = () => true
): any {
  const result = {}

  for (const { key, value, path, isLeaf } of nDomain.deepIterator(
    transformedFormData,
    isTransformedField
  )) {
    if (isLeaf) {
      const unpackedValue = isTransformedField(value)
        ? value.$value
        : unref(value)
      if (predicate({ key, value: unpackedValue, path }) === true) {
        nDomain.set(result, path, nDomain.deepCopy(unpackedValue))
      }
    }
  }

  return result
}

export function disposeForm(form: Form, deletedFormData: any) {
  for (const { value } of nDomain.deepIterator(
    { box: deletedFormData },
    isTransformedField
  )) {
    if (isTransformedField(value)) {
      form.dispose(value.$uid)
    }
  }
}

export function resetFields(form: Form, data: any, transformedFormData: any) {
  Object.entries(data).forEach(([key, value]) => {
    const transformedValue = transformedFormData[key]

    if (isTransformedField(transformedValue)) {
      const field = form.getField(transformedValue.$uid)!
      field.reset(value)
      return
    }

    if (nDomain.isObject(value)) {
      resetFields(form, value, transformedFormData[key])
    }
  })
}

export type Field<
  TValue,
  TExtra extends Record<nDomain.Key, unknown> = Record<string, never>
> = {
  /**
   * The field's default value.
   */
  $value: TValue extends Ref<infer V> ? TValue | V : Ref<TValue> | TValue
  /**
   * Rules to use for validation.
   */
  $rules?: FieldRule<TValue>[]
} & (TExtra extends Record<string, never> ? unknown : TExtra)

export type ValidateOptions = {
  /**
   * Set the field touched when called.
   *
   * @default true
   */
  setTouched?: boolean
  /**
   * Validate with the `force` flag set.
   *
   * @default true
   */
  force?: boolean
}

export type TransformedField<
  TValue,
  TExtra extends Record<nDomain.Key, unknown> = Record<string, never>
> = {
  /**
   * The unique id of this field.
   */
  $uid: number
  /**
   * The current field's value.
   */
  $value: TValue
  /**
   * A list of validation error messages local to the field without `null` values.
   */
  $errors: string[]
  /**
   * The field's raw error messages one for each rule and `null` if there is no error.
   */
  $rawErrors: (string | null)[]
  /**
   * `True` while there are any errors on the field.
   */
  $hasError: boolean
  /**
   * `True` while the field has any pending rules.
   */
  $validating: boolean
  /**
   * `True` if the field is touched.
   *
   * @remarks
   * In most cases, it should be set together with the `blur` event.
   * Either through `$validate` or manually.
   */
  $touched: boolean
  /**
   * `True` if the `$value` of the field has changed at least once.
   */
  $dirty: boolean
  /**
   * Validate the field.
   *
   * @param options - Validation options to use
   * @default
   * ```
   * { setTouched: true, force: true }
   * ```
   */
  $validate(options?: ValidateOptions): void
} & (TExtra extends Record<string, never> ? unknown : UnwrapRef<TExtra>)

export type ResultFormData<FormData extends object | undefined> =
  FormData extends undefined
    ? undefined
    : {
        [K in keyof FormData]: FormData[K] extends
          | { $value: infer TValue }
          | undefined
          ? UnwrapRef<Exclude<TValue, Ref>>
          : FormData[K] extends object | undefined
          ? ResultFormData<FormData[K]>
          : FormData[K]
      }

export type FieldNames<T> = T extends (infer TArray)[]
  ? FieldNames<TArray>
  : {
      [K in keyof T]-?: T[K] extends { $value: any } | undefined
        ? K
        : FieldNames<T[K]>
    }[keyof T]

export type TransformedFormData<FormData extends object | undefined> =
  FormData extends undefined
    ? undefined
    : {
        [K in keyof FormData]: FormData[K] extends
          | { $value: infer TValue }
          | undefined
          ? FormData[K] extends undefined
            ? undefined
            : TransformedField<
                UnwrapRef<Exclude<TValue, Ref>>,
                Omit<Exclude<FormData[K], undefined>, '$value' | '$rules'>
              >
          : FormData[K] extends object | undefined
          ? TransformedFormData<FormData[K]>
          : FormData[K]
      }
