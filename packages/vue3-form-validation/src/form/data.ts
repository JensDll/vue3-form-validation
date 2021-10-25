import { isReactive, ComputedRef, Ref, UnwrapRef, unref } from 'vue'
import { Form } from './Form'
import { FieldRule, RuleInformation } from './rules'
import { VALIDATION_CONFIG } from '../validationConfig'
import * as n_domain from '../domain'

type DeepMaybeRefRecord<T extends Record<n_domain.Key, unknown> | undefined> =
  T extends undefined
    ? undefined
    : {
        [K in keyof T]: T[K] extends Ref
          ? T[K] | UnwrapRef<T[K]>
          : T[K] extends any[]
          ? n_domain.MaybeRef<T[K]>
          : T[K] extends Record<string, unknown> | undefined
          ? DeepMaybeRefRecord<T[K]>
          : n_domain.MaybeRef<T[K]>
      }

export type DeepMaybeRef<T> = T extends Ref
  ? T | UnwrapRef<T>
  : T extends Record<string, unknown>
  ? DeepMaybeRefRecord<T>
  : n_domain.MaybeRef<T>

export type Field<
  TValue,
  TExtra extends Record<n_domain.Key, unknown> = Record<string, never>
> = {
  /**
   *
   * The field's default value.
   */
  $value: DeepMaybeRef<TValue>
  /**
   *
   * List of rules to use for validation.
   */
  $rules?: FieldRule<TValue>[]
} & (TExtra extends Record<string, never> ? unknown : TExtra)

export type ValidateOptions = {
  /**
   *
   * Set this field touched when called.
   *
   * @default true
   */
  setTouched?: boolean
  /**
   *
   * Validate with the `force` flag set.
   *
   * @default true
   */
  force?: boolean
}

export type TransformedField<
  TValue,
  TExtra extends Record<n_domain.Key, unknown> = Record<string, never>
> = {
  /**
   *
   * The unique id of this field.
   */
  $uid: number
  /**
   *
   * The current field's value.
   */
  $value: TValue
  /**
   *
   * The field's error messages without `null` values.
   */
  $errors: string[]
  /**
   *
   * The field's raw error messages one for each rule and `null` if there is no error.
   */
  $rawErrors: (string | null)[]
  /**
   *
   * `True` if this field has any error.
   */
  $hasError: boolean
  /**
   *
   * `True` if there is at least one async rule validating.
   */
  $validating: boolean
  /**
   *
   * `True` after this field was touched.
   *
   * @remarks
   * In most cases, this value should be set together with the `blur` event.
   * Either through `$validate` or manually.
   */
  $touched: boolean
  /**
   *
   * `True` after the `$value` property was changed at least once.
   */
  $dirty: boolean
  /**
   *
   * Validate this field.
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
          ? UnwrapRef<TValue>
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
                UnwrapRef<TValue>,
                Omit<Exclude<FormData[K], undefined>, '$value' | '$rules'>
              >
          : FormData[K] extends object | undefined
          ? TransformedFormData<FormData[K]>
          : FormData[K]
      }

export const isField = <T>(x: unknown): x is Field<T> =>
  n_domain.isRecord(x) ? '$value' in x : false

export const isTransformedField = <T>(x: unknown): x is TransformedField<T> =>
  n_domain.isRecord(x) ? '$uid' in x && '$value' in x : false

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
        console.warn(
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

function registerField(
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
  const uid = n_domain.uid()
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
  for (const { key, value, parent } of n_domain.deepIterator(formData)) {
    if (isField(value)) {
      const transformedField = registerField(form, key, value)
      parent[key] = transformedField
    }
  }
}

export function getResultFormData(
  transformedFormData: any,
  predicate: (
    value: Omit<n_domain.DeepIteratorResult, 'isLeaf' | 'parent'>
  ) => unknown = () => true
): any {
  const result = {}

  for (const { key, value, path, isLeaf } of n_domain.deepIterator(
    transformedFormData,
    isTransformedField
  )) {
    if (isLeaf) {
      const unpackedValue = isTransformedField(value)
        ? value.$value
        : unref(value)
      if (predicate({ key, value: unpackedValue, path }) === true) {
        // Value is reactive -> value is an object or array
        // Make sure to do a deep clone to loose the reactive reference
        if (isReactive(unpackedValue)) {
          n_domain.set(result, path, n_domain.deepCopy(unpackedValue))
        } else {
          n_domain.set(result, path, unpackedValue)
        }
      }
    }
  }

  return result
}

export function disposeForm(form: Form, deletedFormData: any) {
  for (const { value } of n_domain.deepIterator(
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

    if (n_domain.isObject(value)) {
      resetFields(form, value, transformedFormData[key])
    }
  })
}
