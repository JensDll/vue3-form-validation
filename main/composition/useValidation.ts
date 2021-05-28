import { reactive, Ref, ComputedRef, UnwrapRef } from 'vue';
import {
  cleanupForm,
  getResultFormData,
  path as _path,
  PromiseCancel,
  resetFields,
  set,
  transformFormData
} from '../common';
import { Form } from '../form/Form';
import { ValidationError } from '../form/ValidationError';
import { RefUnref } from '../types';

export type SimpleRule<T = any> = (value: T) => any;
export type KeyedRule = {
  key: string;
  rule?: (...values: any[]) => any;
};
export type Rule<T = any> = SimpleRule<T> | KeyedRule;

export type Field<TValue> = {
  $value: RefUnref<TValue>;
  $rules?: Rule<TValue extends any[] ? TValue : UnwrapRef<TValue>>[];
};

export type TransformedField<T> = {
  $uid: number;
  $value: T;
  $errors: string[];
  $hasError: boolean;
  $validating: boolean;
  $onBlur(): void;
};

export type TransformedFormData<T extends object> = T extends any
  ? {
      [K in keyof T]: T[K] extends Field<infer TValue> | undefined
        ? T[K] & Field<any> extends Field<any>
          ? TransformedField<UnwrapRef<TValue>>
          : TransformedField<UnwrapRef<TValue>>
        : T[K] extends Record<string, unknown> | any[]
        ? TransformedFormData<T[K]>
        : T[K];
    }
  : never;

export type FormData<T extends object> = T extends any
  ? {
      [K in keyof T]: T[K] extends Field<infer TValue> | undefined
        ? T[K] & Field<any> extends Field<any>
          ? UnwrapRef<TValue>
          : UnwrapRef<TValue>
        : T[K] extends Record<string, unknown> | any[]
        ? FormData<T[K]>
        : T[K];
    }
  : never;

export type Keys = readonly (string | number)[];
export type DeepIndex<T, Ks extends Keys, R = unknown> = Ks extends [
  infer First,
  ...infer Rest
]
  ? First extends keyof T
    ? Rest extends Keys
      ? DeepIndex<T[First], Rest>
      : R
    : R
  : T;

type UseValidation<T extends object> = {
  form: TransformedFormData<T>;
  submitting: Ref<boolean>;
  errors: ComputedRef<string[]>;
  validateFields(): Promise<FormData<T>>;
  resetFields(formData?: Partial<FormData<T>>): void;
  add<Ks extends Keys>(
    path: readonly [...Ks],
    value: DeepIndex<T, Ks> extends Array<infer TArray>
      ? TArray
      : DeepIndex<T, Ks>
  ): void;
  remove(path: (string | number)[]): void;
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

      const resultFormData = getResultFormData(transformedFormData);

      const hasError = await promiseCancel.race(form.validateAll());

      form.submitting.value = false;

      if (hasError) {
        throw new ValidationError();
      }

      return resultFormData as FormData<T>;
    },

    resetFields(formData) {
      if (form.submitting.value) {
        promiseCancel.cancelResolve(true);
      }

      if (formData) {
        form.resetFields(false);
        resetFields(formData, transformedFormData);
      } else {
        form.resetFields();
      }
    },

    add(path, value) {
      const box = { value };
      transformFormData(form, box);

      const x = _path(path, transformedFormData);

      if (Array.isArray(x)) {
        x.push(box.value);
      } else {
        set(transformedFormData, path, box.value);
      }
    },

    remove(path) {
      const lastKey = (path as unknown as any[]).pop();

      if (typeof lastKey !== 'undefined' && path.length === 0) {
        cleanupForm(form, (transformedFormData as any)[lastKey]);
        delete (transformedFormData as any)[lastKey];
      } else if (typeof lastKey !== 'undefined') {
        const value = _path(path, transformedFormData);

        if (Array.isArray(value)) {
          const deleted = value.splice(+lastKey, 1);
          cleanupForm(form, deleted);
        } else {
          cleanupForm(form, value[lastKey]);
          delete value[lastKey];
        }
      }
    }
  };
}
