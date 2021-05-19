import { computed, isReactive, isRef, reactive, ref } from 'vue';
import { isArray, isObject, deepAssign, isNotNull } from '../common';
import { Rule } from '../composition/useValidation';

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
    return computed(() => this.errors.filter(isNotNull));
  }

  hasError() {
    return computed(() => this.getErrors().value.length > 0);
  }

  reset(toDefaultValues: boolean) {
    this.touched = false;

    if (toDefaultValues) {
      if (isRef(this.modelValue)) {
        if (isArray(this.modelValue.value)) {
          this.modelValue.value = deepAssign([], this.initialModelValue);
        } else {
          this.modelValue.value = this.initialModelValue;
        }
      } else {
        // console.log('Before ' + JSON.stringify(this.modelValue));
        const copy = deepAssign({}, this.initialModelValue);
        Object.assign(this.modelValue, copy);
        // console.log('After ' + JSON.stringify(this.modelValue));
      }
    }

    Object.assign(
      this.errors,
      this.errors.map(() => null)
    );
  }
}
