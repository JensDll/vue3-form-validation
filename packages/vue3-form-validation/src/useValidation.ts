import { reactive, Ref, ComputedRef } from 'vue'
import * as n_form from './form'
import * as n_domain from './domain'

type UseValidation<FormData extends object> = {
  form: n_form.TransformedFormData<FormData>
  submitting: Ref<boolean>
  errors: ComputedRef<string[]>
  validateFields(
    names?: n_form.FieldNames<FormData>[] | string[]
  ): Promise<n_form.ResultFormData<FormData>>
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
 * @param formData - The structure of your Form Data.
 * @description
 * Vue composition function for Form Validation.
 * @docs
 * https://github.com/JensDll/vue3-form-validation
 * @typescript
 * For better type inference, consider defining the structure
 * of your `formData` upfront and pass it as the generic parameter `FormData`:
 * ```
 * type FormData = {
 *   name: Field<string>,
 *   email: Field<string>,
 *   password: Field<string>
 * }
 *
 * const { ... } = useValidation<FormData>({ ... })
 * ```
 */
export function useValidation<FormData extends object>(
  formData: FormData
): UseValidation<FormData> {
  const form = new n_form.Form()
  const promiseCancel = new n_domain.PromiseCancel<n_form.ValidationError>()

  const disposables = n_form.transformFormData(form, formData)

  const transformedFormData: any = reactive(formData)

  return {
    form: transformedFormData as n_form.TransformedFormData<FormData>,
    submitting: form.submitting,
    errors: form.errors,

    async validateFields(names) {
      form.submitting.value = true

      const resultFormData = n_form.getResultFormData(
        transformedFormData
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
        n_form.transformFormData(form, box).forEach((fs, uid) => {
          disposables.set(uid, fs)
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
          n_form.cleanupForm(form, transformedFormData[lastKey], disposables)
          delete transformedFormData[lastKey]
        } else {
          const valueAtPath = n_domain.path(path, transformedFormData)
          if (Array.isArray(valueAtPath)) {
            const deletedFormData = valueAtPath.splice(+lastKey, 1)
            n_form.cleanupForm(form, deletedFormData, disposables)
          } else {
            n_form.cleanupForm(form, valueAtPath[lastKey], disposables)
            delete valueAtPath[lastKey]
          }
        }
      }
    }
  }
}

// type FormData = {
//   text: n_form.Field<string>
// }

// useValidation<FormData>({
//   text: {
//     $value: '',
//     $rules: [
//       x => x,
//       { key: 'a', rule: x => x },
//       ['lazy', x => x],
//       ['aggresive', { key: 'b', rule: x => x }]
//     ]
//   }
// })
