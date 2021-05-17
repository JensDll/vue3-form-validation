import { computed, isRef, reactive, ref, unref } from 'vue';
import { deepAssign } from '../common/deep-assign/deepAssign';
import { Rule } from '../composition/useValidation';

const notNull = <T>(value: T | null): value is T => value !== null;

export class FormField {
  modelValue: ReturnType<typeof ref> | ReturnType<typeof reactive>;
  touched = false;
  rulesValidating = ref(0);

  private errors: (string | null)[];
  private initialModelValue: unknown;

  constructor(rules: Rule[], modelValue: unknown) {
    this.errors = reactive(rules.map(() => null));

    modelValue = unref(modelValue);

    if (typeof modelValue === 'object' && modelValue !== null) {
      if (Array.isArray(modelValue)) {
        this.modelValue = ref(modelValue);
        this.initialModelValue = deepAssign([], modelValue);
      } else {
        this.modelValue = reactive(modelValue);
        this.initialModelValue = deepAssign({}, this.modelValue);
      }
    } else {
      this.modelValue = ref(modelValue);
      this.initialModelValue = modelValue;
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

  validating() {
    return computed(() => this.rulesValidating.value > 0);
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
