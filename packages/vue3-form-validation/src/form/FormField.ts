import { computed, isReactive, isRef, reactive, ref, unref } from 'vue'
import { ValidationBehavior } from './validationBehavior'
import * as n_domain from '../domain'
import { Form } from './Form'
import { ValidationBehaviorString } from '.'

export class FormField {
  private _errors: (string | null)[]
  private _rulesValidating = ref(0)
  private _validationBehavior: ValidationBehavior

  initialModelValue: any
  name: string
  touched = false
  modelValue: ReturnType<typeof ref> | ReturnType<typeof reactive>
  errors = computed(() => this._errors.filter(n_domain.isDefined))
  validating = computed(() => this._rulesValidating.value > 0)
  hasError = computed(() => this.errors.value.length > 0)

  constructor(
    name: string,
    modelValue: any,
    validationBehavior: ValidationBehavior,
    rules: n_domain.Rule[]
  ) {
    this.name = name
    this._validationBehavior = validationBehavior
    this._errors = reactive(rules.map(() => null))

    if (isRef(modelValue) || isReactive(modelValue)) {
      this.modelValue = modelValue
      this.initialModelValue = n_domain.deepCopy(unref(modelValue))
    } else if (n_domain.isRecord(modelValue)) {
      this.modelValue = reactive(modelValue)
      this.initialModelValue = n_domain.deepCopy(this.modelValue)
    } else {
      this.modelValue = ref(modelValue)
      this.initialModelValue = n_domain.deepCopy(unref(modelValue))
    }
  }

  setError(ruleNumber: number, error: string | null) {
    this._errors[ruleNumber] = error
  }

  increaseRulesValidating() {
    this._rulesValidating.value++
  }

  decreaseRulesValidating() {
    this._rulesValidating.value++
  }

  getValidationBehavior(form: Form) {
    return typeof this._validationBehavior === 'function'
      ? this._validationBehavior({
          submitCount: form.submitCount,
          errorMessages: this.errors.value
        })
      : this._validationBehavior
  }

  shouldValidate(
    form: Form,
    validationBehavior?: ValidationBehaviorString
  ): boolean {
    switch (validationBehavior || this.getValidationBehavior(form)) {
      case 'aggresive':
        return true
      case 'lazy':
        if (this.touched) {
          return true
        }
        break
      case 'lazier':
        if (this.touched && this.hasError.value) {
          return true
        }
        break
    }

    return false
  }

  reset(toDefaultValues: boolean) {
    this.touched = false

    if (toDefaultValues) {
      if (isRef(this.modelValue)) {
        if (n_domain.isArray(this.modelValue.value)) {
          this.modelValue.value = n_domain.deepCopy(this.initialModelValue)
        } else {
          this.modelValue.value = this.initialModelValue
        }
      } else {
        const copy = n_domain.deepCopy(this.initialModelValue)
        Object.assign(this.modelValue, copy)
      }
    }

    Object.assign(
      this._errors,
      this._errors.map(() => null)
    )
  }
}
