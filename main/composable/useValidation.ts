import { reactive, Ref, watch } from 'vue';
import useUid from './useUid';
import Form from '../Form';
import { path } from '../utils';

export type SimpleRule<T = any> = (value: T) => Promise<unknown> | unknown;
export type KeyedRule<T = any> = { key: string; rule: SimpleRule<T> };
export type Rule<T = any> = SimpleRule<T> | KeyedRule<T>;

export type Field<T> = {
  value: Ref<T> | T;
  rules?: Rule<T>[];
};

export type TransformedField<T> = {
  uid: number;
  value: T;
  errors: string[];
  validating: boolean;
  onBlur(): void;
};

type ValidateFormData<T> = T extends unknown
  ? {
      [K in keyof T]: T[K] extends Field<infer TValue>
        ? Field<TValue>
        : T[K] extends Array<infer TArray>
        ? ValidateFormData<TArray>[]
        : T[K] extends Record<string, unknown>
        ? ValidateFormData<T[K]>
        : never;
    }
  : never;

type TransformedFormData<T> = T extends unknown
  ? {
      [K in keyof T]: T[K] extends Field<infer TValue>
        ? TransformedField<TValue>
        : T[K] extends Array<infer TArray>
        ? TransformedFormData<TArray>[]
        : T[K] extends Record<string, unknown>
        ? TransformedFormData<T[K]>
        : never;
    }
  : never;

type FormData<T> = T extends unknown
  ? {
      [K in keyof T]: T[K] extends Field<infer TValue>
        ? TValue
        : T[K] extends Array<infer TArray>
        ? FormData<TArray>[]
        : T[K] extends Record<string, unknown>
        ? FormData<T[K]>
        : never;
    }
  : never;

export const isSimpleRule = (rule: Rule): rule is SimpleRule =>
  typeof rule === 'function';

export const isKeyedRule = (rule: Rule): rule is KeyedRule =>
  typeof rule === 'object'
    ? 'key' in rule &&
      'rule' in rule &&
      typeof rule.key === 'string' &&
      isSimpleRule(rule.rule)
    : false;

export const isField = <T>(field: any): field is Field<T> =>
  typeof field === 'object' ? 'value' in field : false;

export const isTransformedField = <T>(
  field: any
): field is TransformedField<T> =>
  typeof field === 'object'
    ? 'uid' in field &&
      'value' in field &&
      'errors' in field &&
      'validating' in field
    : false;

/**
 *
 * @param form Form object with methods like `registerField` and `validate`.
 * @param formData The form data to transform.
 * @description In place transformation of a given form data object.
 * Recursively add's some metadata to every form field.
 */
export function transformFormData(form: Form, formData: any) {
  Object.entries(formData).forEach(([key, value]) => {
    if (isField(value)) {
      const uid = useUid();
      const formField = form.registerField(uid, value.rules ?? []);

      formData[key] = reactive({
        uid,
        value: value.value,
        errors: formField.getErrors(),
        validating: formField.validating(),
        async onBlur() {
          if (!formField.touched) {
            formField.touched = true;
            await form.validate(uid);
          }
        }
      });

      formField.modelValue = formData[key].value;

      watch(
        () => formData[key].value,
        async (modelValue: unknown) => {
          formField.modelValue = modelValue;
          if (formField.touched) {
            await form.validate(uid);
          }
        }
      );

      return;
    }

    transformFormData(form, value);
  });
}

export function cleanupForm(form: Form, formData: any) {
  Object.values(formData).forEach(value => {
    if (isTransformedField(value)) {
      form.onDelete(value.uid);
      return;
    }

    cleanupForm(form, value);
  });
}

export function getResultFormData(formData: any, resultFormData: any) {
  Object.entries(formData).forEach(([key, value]) => {
    if (isTransformedField(value)) {
      resultFormData[key] = value.value;
      return;
    }

    resultFormData[key] = {};

    if (Array.isArray(value)) {
      resultFormData[key] = [];
    }

    getResultFormData(value, resultFormData[key]);
  });
}

export function useValidation<T>(formData: T & ValidateFormData<T>) {
  const form = new Form();

  transformFormData(form, formData);

  const reactiveFormData = reactive(formData) as any;

  return {
    form: reactiveFormData as TransformedFormData<T>,

    onSubmit: (
      success: (formData: FormData<T>) => void,
      errror?: () => void
    ) => {
      form.validateAll().then(hasError => {
        if (hasError) {
          errror?.();
        } else {
          const resultFormData = {} as any;
          getResultFormData(reactiveFormData, resultFormData);
          success(resultFormData);
        }
      });
    },

    add(pathToArray: (string | number)[], value: Record<string, unknown>) {
      const xs = path(pathToArray, reactiveFormData);

      if (Array.isArray(xs)) {
        transformFormData(form, value);
        xs.push(value);
      }
    },

    remove(pathToArray: (string | number)[], index: number) {
      const xs = path(pathToArray, reactiveFormData);

      if (Array.isArray(xs)) {
        const deleted = xs.splice(index, 1);
        deleted.forEach(deleted => cleanupForm(form, deleted));
      }
    }
  };
}
