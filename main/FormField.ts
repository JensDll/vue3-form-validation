import { computed, isRef, reactive, ref } from 'vue';
import { Rule } from './composable/useValidation';

const notNull = <T>(value: T | null): value is T => value !== null;

export default class FormField {
  private errors: (string | null)[];

  rulesValidating = ref(0);
  modelValue: ReturnType<typeof ref> | ReturnType<typeof reactive>;
  private initialModelValue: unknown;
  touched = false;

  constructor(rules: Rule[], modelValue: unknown) {
    this.errors = reactive(rules.map(() => null));

    if (isRef(modelValue)) {
      this.modelValue = modelValue;
      this.initialModelValue = modelValue.value;
    } else if (
      typeof modelValue === 'object' &&
      !Array.isArray(modelValue) &&
      modelValue !== null
    ) {
      this.modelValue = reactive(modelValue);
      this.initialModelValue = JSON.parse(JSON.stringify(this.modelValue));
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

  validating() {
    return computed(() => this.rulesValidating.value > 0);
  }

  reset() {
    this.touched = false;

    if (isRef(this.modelValue)) {
      this.modelValue.value = this.initialModelValue;
    } else {
      Object.assign(this.modelValue, this.initialModelValue);
      this.initialModelValue = JSON.parse(
        JSON.stringify(this.initialModelValue)
      );
    }

    Object.assign(
      this.errors,
      this.errors.map(() => null)
    );
  }
}
