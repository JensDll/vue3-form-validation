import { isReactive, reactive, Ref, watch, UnwrapRef } from 'vue';
import useUid from './useUid';
import Form from '../Form';
import { path } from '../utils';

export type SimpleRule<T = any> = (value: T) => Promise<unknown> | unknown;
export type KeyedRule<T = any> = { key: string; rule: SimpleRule<T> };
export type Rule<T = any> = SimpleRule<T> | KeyedRule<T>;

export type Field<T> = {
  $value: Ref<T> | T;
  $rules?: Rule<T>[];
};

export type TransformedField<T> = {
  $uid: number;
  $value: T;
  $errors: string[];
  $validating: boolean;
  $onBlur(): void;
};

type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>;

type ValidateFormData<T> = {
  [K in keyof T]: T[K] extends { $value: infer TValue }
    ? TValue extends Ref<infer TRef>
      ? Field<TRef>
      : Field<TValue>
    : T[K] extends Array<infer TArray>
    ? ValidateFormData<TArray>[]
    : T[K] extends Record<string, unknown>
    ? ValidateFormData<T[K]>
    : unknown;
};

type TransformedFormData<T> = T extends any
  ? {
      [K in keyof T]: T[K] extends Field<infer TValue>
        ? TransformedField<TValue>
        : T[K] extends Array<infer TArray>
        ? TransformedFormData<TArray>[]
        : T[K] extends Record<string, unknown>
        ? TransformedFormData<T[K]>
        : T[K];
    }
  : never;

type FormData<T> = T extends any
  ? {
      [K in keyof T as T[K] extends any[]
        ? K
        : T[K] extends Record<string, unknown>
        ? K
        : never]: T[K] extends Field<infer TValue>
        ? UnwrapNestedRefs<TValue>
        : T[K] extends Array<infer TArray>
        ? FormData<TArray>[]
        : T[K] extends Record<string, unknown>
        ? FormData<T[K]>
        : never;
    }
  : never;

type Keys = readonly (string | number)[];
type DeepIndex<T, Ks extends Keys> = Ks extends [infer First, ...infer Rest]
  ? First extends keyof T
    ? Rest extends Keys
      ? DeepIndex<T[First], Rest>
      : undefined
    : undefined
  : T;

const isField = <T>(field: any): field is Field<T> =>
  typeof field === 'object' ? '$value' in field : false;

const isTransformedField = <T>(field: any): field is TransformedField<T> =>
  typeof field === 'object'
    ? '$uid' in field &&
      '$value' in field &&
      '$errors' in field &&
      '$validating' in field
    : false;

/**
 *
 * @param form - Form object with methods like `registerField` and `validate`.
 * @param formData - The form data to transform.
 * @description In place transformation of a given form data object.
 * Recursively add's some metadata to every form field.
 */
export function transformFormData(form: Form, formData: any) {
  Object.entries(formData).forEach(([key, value]) => {
    if (isField(value)) {
      const uid = useUid();
      const formField = form.registerField(uid, value.$rules ?? []);

      formData[key] = reactive({
        $uid: uid,
        $value: value.$value,
        $errors: formField.getErrors(),
        $validating: formField.validating(),
        async $onBlur() {
          if (!formField.touched) {
            formField.touched = true;
            await form.validate(uid);
          }
        }
      });

      formField.modelValue = formData[key].$value;

      const watchHandler = async (modelValue: unknown) => {
        formField.modelValue = modelValue;
        if (formField.touched) {
          await form.validate(uid);
        }
      };

      if (isReactive(formData[key].$value)) {
        watch(formData[key].$value, watchHandler);
      } else {
        watch(() => formData[key].$value, watchHandler);
      }

      return;
    }

    if (typeof value === 'object') {
      transformFormData(form, value);
    }
  });
}

export function cleanupForm(form: Form, formData: any) {
  Object.values(formData).forEach(value => {
    if (isTransformedField(value)) {
      form.onDelete(value.$uid);
      return;
    }

    if (typeof value === 'object') {
      cleanupForm(form, value);
    }
  });
}

export function getResultFormData(formData: any, resultFormData: any) {
  Object.entries(formData).forEach(([key, value]) => {
    if (isTransformedField(value)) {
      resultFormData[key] = value.$value;
      return;
    }

    resultFormData[key] = {};

    if (Array.isArray(value)) {
      resultFormData[key] = [];
    }

    if (typeof value === 'object') {
      getResultFormData(value, resultFormData[key]);
    } else {
      delete resultFormData[key];
    }
  });
}

/**
 *
 * @param formData - The structure of your Form Data
 * @hint
 * To get the best IntelliSense when using TypeScript, consider defining the structure
 * of your `formData` upfront and pass it as the generic parameter `T`.
 */
export function useValidation<T>(formData: T & ValidateFormData<T>) {
  const form = new Form();

  transformFormData(form, formData);

  const reactiveFormData = reactive(formData) as any;

  return {
    form: reactiveFormData as TransformedFormData<T>,

    onSubmit(success: (formData: FormData<T>) => void, error?: () => void) {
      form.validateAll().then(hasError => {
        if (hasError) {
          error?.();
        } else {
          const resultFormData = {} as any;
          getResultFormData(reactiveFormData, resultFormData);
          success(resultFormData);
        }
      });
    },

    add<Ks extends Keys>(
      pathToArray: readonly [...Ks],
      value: DeepIndex<ValidateFormData<T>, Ks> extends Array<infer TArray>
        ? TArray
        : never
    ) {
      const xs = path(pathToArray, reactiveFormData);

      if (Array.isArray(xs)) {
        transformFormData(form, value);
        xs.push(value);
      }
    },

    remove<Ks extends Keys>(
      pathToArray: readonly [...Ks],
      index: DeepIndex<ValidateFormData<T>, Ks> extends any[] ? number : never
    ) {
      const xs = path(pathToArray, reactiveFormData);

      if (Array.isArray(xs)) {
        const deleted = xs.splice(index, 1);
        deleted.forEach(deleted => cleanupForm(form, deleted));
      }
    }
  };
}
