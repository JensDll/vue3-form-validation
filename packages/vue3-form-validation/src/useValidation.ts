import { reactive, Ref, ComputedRef } from 'vue'
import * as n_form from './form'
import * as n_domain from './domain'

export type UseValidation<FormData extends object> = {
  /**
   *
   * The reactive form data.
   */
  form: n_form.TransformedFormData<FormData>
  /**
   *
   * `True` after calling `validateFields` when there are async rules.
   */
  submitting: Ref<boolean>
  /**
   *
   * `True` while there is at least one async rule validating.
   */
  validating: ComputedRef<boolean>
  /**
   *
   * `True` while there is at least one field that has an error.
   */
  hasError: ComputedRef<boolean>
  /**
   *
   * All current validation error messages.
   */
  errors: ComputedRef<string[]>
  /**
   *
   * Validate all fields and return a `Promise` containing the resulting form data.
   *
   * @param options - Options to use for validation
   * @throws `ValidationError`
   */
  validateFields(options?: {
    /**
     *
     * A list of field names to validate.
     *
     * @default
     * ```
     * undefined // meaning validate all
     * ```
     */
    names?: n_form.FieldNames<FormData>[] | string[]
    /**
     *
     * Filter which values to keep in the resulting form data.
     *
     * @remarks
     * Used like `Array.prototype.filter`.
     *
     * @default
     * ```
     * () => true // meaning keep all
     * ```
     */
    predicate?: (
      value: Omit<n_domain.DeepIteratorResult, 'isLeaf' | 'parent'>
    ) => unknown
  }): Promise<n_form.ResultFormData<FormData>>
  /**
   *
   * Reset all fields to their default value or pass an object to set specific values.
   *
   * @remarks
   * It will not create any new fields that are not present in the form data initially.
   *
   * @param formData - Form data to set specific values. It has the same structure as the object passed to `useValidation`.
   */
  resetFields(formData?: Partial<n_form.ResultFormData<FormData>>): void
  /**
   *
   * Adds one or more new properties to the form data.
   *
   * @remarks
   * Fields with a `$value` are transformed.
   *
   * @param path - A path of `string` and `numbers`
   * @param value - The value to add at the specified path
   */
  add<Ks extends readonly n_domain.Key[]>(
    path: readonly [...Ks],
    value: n_domain.DeepIndex<FormData, Ks> extends (infer TArray)[]
      ? TArray
      : n_domain.DeepIndex<FormData, Ks>
  ): void
  /**
   *
   * Removes one or more properties from the form data.
   *
   * @param path - A path of `string` and `numbers` to the properties to remove
   */
  remove(path: n_domain.Key[]): void
}

/**
 *
 * Vue composition function for Form validation.
 *
 * @remarks
 * For better type inference, consider defining the structure
 * of your `formData` upfront and pass it as the generic parameter `FormData`.
 *
 * @param formData - The structure of your Form data
 *
 * @example
 * ```
 * type FormData = {
 *   name: Field<string>,
 *   password: Field<string>
 * }
 *
 * const { form } = useValidation<FormData>({})
 * ```
 */
export function useValidation<FormData extends object>(
  formData: FormData
): UseValidation<FormData> {
  const form = new n_form.Form()
  const promiseCancel = new n_domain.PromiseCancel<n_form.ValidationError>()

  n_form.transformFormData(form, formData)

  const transformedFormData: any = reactive(formData)

  return {
    form: transformedFormData as n_form.TransformedFormData<FormData>,
    submitting: form.submitting,
    validating: form.validating,
    hasError: form.hasError,
    errors: form.errors,

    async validateFields({ names, predicate } = {}) {
      form.submitting.value = true

      const resultFormData = n_form.getResultFormData(
        transformedFormData,
        predicate
      ) as n_form.ResultFormData<FormData>

      try {
        await promiseCancel.race(form.validateAll(names as any))
      } finally {
        form.submitting.value = false
      }

      return resultFormData
    },

    resetFields(formData) {
      if (form.submitting.value) {
        promiseCancel.cancelReject(new n_form.ValidationError())
      }

      if (formData === undefined) {
        form.resetFields()
      } else {
        n_form.resetFields(form, formData, transformedFormData)
      }
    },

    add(path, value) {
      const lastKey = path[path.length - 1]

      if (lastKey !== undefined) {
        const box = { [lastKey]: value }
        n_form.transformFormData(form, box)
        const transformedBox = box[lastKey]
        const valueAtPath = n_domain.path(path, transformedFormData)
        if (Array.isArray(valueAtPath)) {
          valueAtPath.push(transformedBox)
        } else {
          n_domain.set(transformedFormData, path, transformedBox)
        }
      }
    },

    remove(path) {
      const lastKey = path.pop()

      if (lastKey !== undefined) {
        if (path.length === 0) {
          n_form.disposeForm(form, transformedFormData[lastKey])
          delete transformedFormData[lastKey]
        } else {
          const valueAtPath = n_domain.path(path, transformedFormData)
          if (Array.isArray(valueAtPath)) {
            const deletedFormData = valueAtPath.splice(+lastKey, 1)
            n_form.disposeForm(form, deletedFormData)
          } else {
            n_form.disposeForm(form, valueAtPath[lastKey])
            delete valueAtPath[lastKey]
          }
        }
      }
    }
  }
}
