import { reactive, Ref, ComputedRef } from 'vue-demi'

import * as nShared from '@compose-validation/shared'
import { ValidationError } from './ValidationError'
import { Form } from './Form'
import {
  disposeForm,
  FieldNames,
  getResultFormData,
  resetFields,
  ResultFormData,
  TransformFormData,
  transformFormData
} from './data'

/**
 * Vue composition function for form validation.
 *
 * @remarks
 * For type inference in `useValidation` make sure to define the structure of your
 * form data upfront and pass it as the generic parameter `FormData`.
 *
 * @param formData - The structure of your form data
 *
 * @example
 * ```
 * type FormData = {
 *   name: Field<string>,
 *   password: Field<string>
 * }
 *
 * const { form } = useValidation<FormData>({
 *   name: {
 *     $value: '',
 *     $rules: []
 *   },
 *   password: {
 *     $value: '',
 *     $rules: []
 *   }
 * })
 * ```
 */
export function useValidation<FormData extends object>(
  formData: FormData
): UseValidation<FormData> {
  const form = new Form()
  const promiseCancel = new nShared.PromiseCancel<ValidationError>()

  transformFormData(form, formData)

  const transformedFormData: any = reactive(formData)

  return {
    form: transformedFormData,
    submitting: form.submitting,
    validating: form.validating,
    hasError: form.hasError,
    errors: form.errors,

    async validateFields({ names, predicate } = {}) {
      form.submitting.value = true

      const resultFormData = getResultFormData(
        transformedFormData,
        predicate
      ) as ResultFormData<FormData>

      try {
        await promiseCancel.race(form.validateAll(names as any))
      } finally {
        form.submitting.value = false
      }

      return resultFormData
    },

    resetFields(formData) {
      promiseCancel.cancelReject(new ValidationError())
      if (formData === undefined) {
        form.resetFields()
      } else {
        resetFields(form, formData, transformedFormData)
      }
    },

    add(path, value) {
      const lastKey = path[path.length - 1]

      if (lastKey !== undefined) {
        const box = { [lastKey]: value }
        transformFormData(form, box)
        const transformedValue = box[lastKey]
        const valueAtPath = nShared.path(path, transformedFormData)
        if (Array.isArray(valueAtPath)) {
          valueAtPath.push(transformedValue)
        } else {
          nShared.set(transformedFormData, path, transformedValue)
        }
      }
    },

    remove(path) {
      const lastKey = path.pop()

      if (lastKey !== undefined) {
        if (path.length === 0) {
          disposeForm(form, transformedFormData[lastKey])
          delete transformedFormData[lastKey]
        } else {
          const valueAtPath = nShared.path(path, transformedFormData)
          if (Array.isArray(valueAtPath)) {
            const deletedFormData = valueAtPath.splice(+lastKey, 1)
            disposeForm(form, deletedFormData)
          } else {
            disposeForm(form, valueAtPath[lastKey])
            delete valueAtPath[lastKey]
          }
        }
      }
    }
  }
}

export type UseValidation<FormData extends object> = {
  /**
   * A transformed reactive form data object.
   */
  form: TransformFormData<FormData>
  /**
   * `True` during validation after calling `validateFields` when there were rules returning a `Promise`.
   */
  submitting: Ref<boolean>
  /**
   * `True` while the form has any pending rules.
   */
  validating: ComputedRef<boolean>
  /**
   * `True` if the form has any error.
   */
  hasError: ComputedRef<boolean>
  /**
   * All current validation error messages.
   */
  errors: ComputedRef<string[]>
  /**
   * Validate all fields and return a `Promise` containing the resulting form data.
   *
   * @param options - Options to use for validation
   * @throws `ValidationError`
   */
  validateFields(options?: {
    /**
     * A list of field names to validate.
     *
     * @default
     * ```
     * undefined // meaning validate all
     * ```
     */
    names?: FieldNames<FormData>[]
    /**
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
      value: Omit<nShared.DeepIteratorResult, 'isLeaf' | 'parent'>
    ) => unknown
  }): Promise<ResultFormData<FormData>>
  /**
   * Reset all fields to their default value or pass an object to set specific values.
   *
   * @remarks
   * It will not create any new fields not present in the form data initially.
   *
   * @param formData - Form data to set specific values. It has the same structure as the object passed to `useValidation`
   */
  resetFields(formData?: Partial<ResultFormData<FormData>>): void
  /**
   * Adds a new property to the form data.
   *
   * @remarks
   * Fields with a `$value` are transformed.
   *
   * @param path - A path of `string` and `numbers`
   * @param value - The value to add at the specified path
   */
  add<Keys extends readonly (string | number)[]>(
    path: readonly [...Keys],
    value: nShared.DeepIndex<FormData, Keys> extends (infer TArray)[]
      ? TArray
      : nShared.DeepIndex<FormData, Keys>
  ): void
  /**
   * Removes a property from the form data.
   *
   * @param path - A path of `string` and `numbers` to the property to remove
   */
  remove(path: (string | number)[]): void
}
