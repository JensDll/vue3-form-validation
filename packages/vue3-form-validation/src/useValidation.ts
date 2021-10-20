import { reactive, Ref, ComputedRef } from 'vue'
import * as n_form from './form'
import * as n_domain from './domain'

export type UseValidation<FormData extends object> = {
  /**
   * The reactive form data.
   */
  form: n_form.TransformedFormData<FormData>
  /**
   * `True` after calling `validateFields`.
   */
  submitting: Ref<boolean>
  /**
   * Incremented whenever `validateFields` is called.
   */
  submitCount: Ref<number>
  /**
   * `True` while there is at least one async rule validating.
   */
  validating: ComputedRef<boolean>
  /**
   * `True` while there is at least one field which has an error.
   */
  hasError: ComputedRef<boolean>
  /**
   * All current validation error messages.
   */
  errors: ComputedRef<string[]>
  /**
   * Validate all fields and return a `Promise` containing the resulting form data.
   * @param options - Options to use for validation.
   * @throws `ValidationError`
   */
  validateFields(options?: {
    /**
     * Only validate the fields with these names.
     * @default undefined // meaning all
     */
    names?: n_form.FieldNames<FormData>[] | string[]
    /**
     * Filter which values to keep in resulting form data. Used like `Array.prototype.filter`.
     * @default () => true
     */
    predicate?: (value: any) => unknown
  }): Promise<n_form.ResultFormData<FormData>>
  resetFields(formData?: Partial<n_form.ResultFormData<FormData>>): void
  add<Ks extends readonly n_domain.Key[]>(
    path: readonly [...Ks],
    value: n_domain.DeepIndex<FormData, Ks> extends (infer TArray)[]
      ? TArray
      : n_domain.DeepIndex<FormData, Ks>
  ): void
  remove(path: n_domain.Key[]): void
}

/**
 *
 * @param formData - The structure of your Form data.
 * @description
 * Vue composition function for Form validation.
 *
 * [Documentation and examples](https://github.com/JensDll/vue3-form-validation)
 *
 * For better type inference, consider defining the structure
 * of your `formData` upfront and pass it as the generic parameter `FormData`:
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

  const disposeMap = n_form.transformFormData(form, formData)

  const transformedFormData: any = reactive(formData)

  return {
    form: transformedFormData as n_form.TransformedFormData<FormData>,
    submitting: form.submitting,
    submitCount: form.submitCount,
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
        form.resetFields(true)
      } else {
        form.resetFields(false)
        n_form.resetFields(formData, transformedFormData)
      }
    },

    add(path, value) {
      const lastKey = path[path.length - 1]

      if (lastKey !== undefined) {
        const box = { [lastKey]: value }
        n_form.transformFormData(form, box).forEach((dispose, uid) => {
          disposeMap.set(uid, dispose)
        })
        const transformedField = box[lastKey]
        const valueAtPath = n_domain.path(path, transformedFormData)
        if (Array.isArray(valueAtPath)) {
          valueAtPath.push(transformedField)
        } else {
          n_domain.set(transformedFormData, path, transformedField)
        }
      }
    },

    remove(path) {
      const lastKey = path.pop()

      if (lastKey !== undefined) {
        if (path.length === 0) {
          n_form.cleanupForm(form, transformedFormData[lastKey], disposeMap)
          delete transformedFormData[lastKey]
        } else {
          const valueAtPath = n_domain.path(path, transformedFormData)
          if (Array.isArray(valueAtPath)) {
            const deletedFormData = valueAtPath.splice(+lastKey, 1)
            n_form.cleanupForm(form, deletedFormData, disposeMap)
          } else {
            n_form.cleanupForm(form, valueAtPath[lastKey], disposeMap)
            delete valueAtPath[lastKey]
          }
        }
      }
    }
  }
}
