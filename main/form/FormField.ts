import { computed, isReactive, isRef, reactive, ref } from 'vue';
import { deepAssign } from '../common/deep-assign/deepAssign';
import { Rule } from '../composition/useValidation';

const notNull = <T>(value: T | null): value is T => value !== null;

const isObject = (value: any): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isArray = (value: any): value is any[] => Array.isArray(value);

export class FormField {
  modelValue: ReturnType<typeof ref> | ReturnType<typeof reactive>;
  touched = false;
  validating = ref(false);

  private errors: (string | null)[];
  private initialModelValue: unknown;

  constructor(rules: Rule[], modelValue: unknown) {
    this.errors = reactive(rules.map(() => null));

    if (isRef(modelValue)) {
      this.modelValue = modelValue;
      if (isObject(modelValue.value)) {
        this.initialModelValue = deepAssign({}, modelValue.value);
      } else if (isArray(modelValue.value)) {
        this.initialModelValue = deepAssign([], modelValue.value);
      } else {
        this.initialModelValue = modelValue.value;
      }
    } else if (isReactive(modelValue)) {
      this.modelValue = modelValue as object;
      this.initialModelValue = deepAssign({}, modelValue);
    } else {
      if (isObject(modelValue)) {
        this.modelValue = reactive(modelValue);
        this.initialModelValue = deepAssign({}, this.modelValue);
      } else if (isArray(modelValue)) {
        this.modelValue = ref(modelValue);
        this.initialModelValue = deepAssign([], modelValue);
      } else {
        this.modelValue = ref(modelValue);
        this.initialModelValue = modelValue;
      }
    }
  }

  setError(ruleNumber: number, error: string | null) {
    this.errors[ruleNumber] = error;
  }

  getErrors() {
    return computed(() => this.errors.filter(notNull));
  }

  hasError() {
    return computed(() => this.getErrors().value.length > 0);
  }

  reset(toDefaultValues: boolean) {
    this.touched = false;

    if (toDefaultValues) {
      if (isRef(this.modelValue)) {
        this.modelValue.value = this.initialModelValue;
      } else {
        deepAssign(this.modelValue, this.initialModelValue);
      }
    }

    deepAssign(
      this.errors,
      this.errors.map(() => null)
    );
  }
}
