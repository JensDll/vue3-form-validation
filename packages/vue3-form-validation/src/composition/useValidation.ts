import { reactive, Ref, ComputedRef, UnwrapRef } from 'vue'
import * as n_form from '../form'
import * as n_domain from '../domain'

export type Field<TValue> = {
  $value: n_domain.DeepMaybeRef<TValue>
  $rules?: n_domain.Rule<TValue extends any[] ? TValue : UnwrapRef<TValue>>[]
  $validationBehaviour?: n_form.ValidationBehavior
}

export type TransformedField<T> = {
  $uid: number
  $value: T
  $errors: string[]
  $hasError: boolean
  $validating: boolean
  $listener: {
    blur: EventListener
  }
}

export type TransformedFormData<FormData extends object> = FormData extends any
  ? {
      [K in keyof FormData]: FormData[K] extends
        | { $value: infer TValue }
        | undefined
        ? FormData[K] extends undefined
          ? undefined
          : TransformedField<UnwrapRef<TValue>>
        : FormData[K] extends object
        ? TransformedFormData<FormData[K]>
        : FormData[K]
    }
  : never

type ResultFormData<FormData extends object> = FormData extends any
  ? {
      [K in keyof FormData]: FormData[K] extends
        | { $value: infer TValue }
        | undefined
        ? UnwrapRef<TValue>
        : FormData[K] extends object
        ? ResultFormData<FormData[K]>
        : FormData[K]
    }
  : never

type FieldNames<T> = T extends (infer TArray)[]
  ? FieldNames<TArray>
  : {
      [K in keyof T]-?: T[K] extends { $value: any } | undefined
        ? K
        : FieldNames<T[K]>
    }[keyof T]

type UseValidation<FormData extends object> = {
  form: TransformedFormData<FormData>
  submitting: Ref<boolean>
  errors: ComputedRef<string[]>
  validateFields(
    names?: FieldNames<FormData>[] | string[]
  ): Promise<ResultFormData<FormData>>
  resetFields(formData?: Partial<ResultFormData<FormData>>): void
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

  n_form.transformFormData(form, formData)

  const transformedFormData: any = reactive(formData)

  return {
    form: transformedFormData as TransformedFormData<FormData>,
    submitting: form.submitting,
    errors: form.errors,

    async validateFields(names) {
      form.submitting.value = true

      const resultFormData = n_form.getResultFormData(
        transformedFormData
      ) as ResultFormData<FormData>

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
        n_form.transformFormData(form, box)
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
          n_form.cleanupForm(form, transformedFormData[lastKey])
          delete transformedFormData[lastKey]
        } else {
          const valueAtPath = n_domain.path(path, transformedFormData)
          if (Array.isArray(valueAtPath)) {
            const deletedFormData = valueAtPath.splice(+lastKey, 1)
            n_form.cleanupForm(form, deletedFormData)
          } else {
            n_form.cleanupForm(form, valueAtPath[lastKey])
            delete valueAtPath[lastKey]
          }
        }
      }
    }
  }
}
