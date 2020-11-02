import { computed, ref, Ref } from 'vue';
import { Rule } from './composable/useForm';

const notNull = <T>(value: T | null): value is T => value !== null;

export default class FormField {
  private errors: Ref<(string | null)[]>;
  private waiting: number[];
  private totalWaiting = ref(0);
  private errorCount = 0;

  modelValue: unknown;
  touched = false;

  constructor(rules: Rule[]) {
    this.errors = ref(rules.map(() => null));
    this.waiting = rules.map(() => 0);
  }

  setError(index: number, error: string | null) {
    const willBeSet = this.errors.value[index];

    if (willBeSet === null && typeof error === 'string') {
      this.errorCount++;
    }

    if (typeof willBeSet === 'string' && error === null) {
      this.errorCount--;
    }

    this.errors.value[index] = error;
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
    return computed(() => this.errors.value.filter(notNull));
  }

  validating() {
    return computed(() => this.totalWaiting.value > 0);
  }
}
