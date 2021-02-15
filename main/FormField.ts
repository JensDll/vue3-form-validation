import { computed, isRef, reactive, ref } from 'vue';
import { Rule } from './composable/useValidation';

const notNull = <T>(value: T | null): value is T => value !== null;

export default class FormField {
  private errors: (string | null)[];
  private waiting: number[];
  private totalWaiting = ref(0);
  private errorCount = 0;

  modelValue: ReturnType<typeof ref> | ReturnType<typeof reactive>;
  private initialModelValue: unknown;
  touched = false;

  constructor(rules: Rule[], modelValue: unknown) {
    this.errors = reactive(rules.map(() => null));
    this.waiting = rules.map(() => 0);

    if (isRef(modelValue)) {
      this.modelValue = modelValue;
      this.initialModelValue = modelValue.value;
    } else if (typeof modelValue === 'object' && modelValue !== null) {
      this.modelValue = reactive(modelValue);
      this.initialModelValue = JSON.parse(JSON.stringify(this.modelValue));
    } else {
      this.modelValue = ref(modelValue);
      this.initialModelValue = modelValue;
    }
  }

  setError(index: number, error: string | null) {
    const willBeSet = this.errors[index];

    if (willBeSet === null && typeof error === 'string') {
      this.errorCount++;
    }

    if (typeof willBeSet === 'string' && error === null) {
      this.errorCount--;
    }

    this.errors[index] = error;
  }

  incrementWaiting(index: number) {
    this.totalWaiting.value++;
    this.waiting[index]++;
  }

  decrementWaiting(index: number) {
    this.totalWaiting.value--;
    this.waiting[index]--;
  }

  nooneIsWaiting(index: number) {
    return this.waiting[index] === 0;
  }

  hasError() {
    return this.errorCount > 0;
  }

  getErrors() {
    return computed(() => this.errors.filter(notNull));
  }

  validating() {
    return computed(() => this.totalWaiting.value > 0);
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

    this.errorCount = 0;
  }
}
