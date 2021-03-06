import { reactive, Ref, ComputedRef, UnwrapRef } from 'vue';
import Form from '../Form';
import {
  cleanupForm,
  getResultFormData,
  path,
  PromiseCancel,
  resetFields,
  transformFormData
} from '../utils';

export type SimpleRule<T = any> = (value: T) => any;
export type KeyedRule<T = any> = { key: string; rule: SimpleRule<T> };
export type Rule<T = any> = SimpleRule<T> | KeyedRule<T>;

export type Field<TValue> = {
  $value: TValue extends Ref
    ? TValue | UnwrapRef<TValue>
    : TValue extends any[]
    ? TValue
    : TValue extends Record<string, unknown>
    ? RefUnref<TValue>
    : Ref<TValue> | TValue;
  $rules?: Rule<UnwrapRef<TValue>>[];
};

export type TransformedField<T> = {
  $uid: number;
  $value: T;
  $errors: string[];
  $validating: boolean;
  $onBlur(): void;
};

export type RefUnref<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Ref
    ? T[K] | UnwrapRef<T[K]>
    : T[K] extends any[]
    ? T[K]
    : T[K] extends Record<string, unknown>
    ? RefUnref<T[K]>
    : Ref<T[K]> | T[K];
};

export type TransformedFormData<T extends object> = T extends any
  ? {
      [K in keyof T]: T[K] extends { $value: infer TValue }
        ? TransformedField<UnwrapRef<TValue>>
        : T[K] extends Record<string, unknown> | any[]
        ? TransformedFormData<T[K]>
        : T[K];
    }
  : never;

export type FormData<T extends object> = T extends any
  ? {
      [K in keyof T]: T[K] extends { $value: infer TValue }
        ? UnwrapRef<TValue>
        : T[K] extends Record<string, unknown> | any[]
        ? FormData<T[K]>
        : T[K];
    }
  : never;

export type Keys = readonly (string | number)[];
export type DeepIndex<T, Ks extends Keys> = Ks extends [
  infer First,
  ...infer Rest
]
  ? First extends keyof T
    ? Rest extends Keys
      ? DeepIndex<T[First], Rest>
      : undefined
    : undefined
  : T;

type UseValidation<T extends object> = {
  form: TransformedFormData<T>;
  submitting: Ref<boolean>;
  errors: ComputedRef<string[]>;
  validateFields(): Promise<FormData<T>>;
  resetFields(formData?: FormData<T>): void;
  add<Ks extends Keys>(
    pathToArray: readonly [...Ks],
    value: DeepIndex<T, Ks> extends Array<infer TArray> ? TArray : never
  ): void;
  remove<Ks extends Keys>(
    pathToArray: readonly [...Ks],
    index: DeepIndex<T, Ks> extends any[] ? number : never
  ): void;
};

/**
 *
 * @param formData The structure of your Form Data.
 * @description
 * Vue composition function for Form Validation.
 * @docs
 * https://github.com/JensDll/vue3-form-validation
 * @typescript
 * For better type inference, consider defining the structure
 * of your `formData` upfront and pass it as the generic parameter `T`:
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
export function useValidation<T extends object>(formData: T): UseValidation<T> {
  const form = new Form();
  const promiseCancel = new PromiseCancel<true>();

  transformFormData(form, formData);

  const transformedFormData = reactive(formData) as TransformedFormData<T>;

  return {
    form: transformedFormData,

    submitting: form.submitting,

    errors: form.getErrors(),

    async validateFields() {
      form.submitting.value = true;

      const resultFormData = {};
      getResultFormData(transformedFormData, resultFormData);

      const hasError = await promiseCancel.race(form.validateAll());

      form.submitting.value = false;

      if (hasError) {
        throw void 0;
      }

      return resultFormData as FormData<T>;
    },

    resetFields(formData) {
      if (form.submitting.value) {
        promiseCancel.cancelResolve(true);
      }

      if (formData) {
        form.resetFields(false);
        resetFields(transformedFormData, formData);
      } else {
        form.resetFields();
      }
    },

    add(pathToArray, value) {
      const xs = path(pathToArray, transformedFormData);

      if (Array.isArray(xs)) {
        transformFormData(form, value);
        xs.push(value);
      }
    },

    remove(pathToArray, index) {
      const xs = path(pathToArray, transformedFormData);

      if (Array.isArray(xs)) {
        const deleted = xs.splice(index, 1);
        deleted.forEach(deleted => cleanupForm(form, deleted));
      }
    }
  };
}
