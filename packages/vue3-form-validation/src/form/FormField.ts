import { computed, isReactive, isRef, reactive, ref, unref } from 'vue'
import {
  ValidationBehavior,
  ValidationBehaviorString
} from './validationBehavior'
import { Form } from './Form'
import * as n_domain from '../domain'

type Rule = ((...modelValues: unknown[]) => any) | undefined

export class FormField {
  private _rules: Rule[]
  private _buffers: n_domain.LinkedList<boolean>[]
  private _errors: (string | null)[]
  private _validationBehavior: ValidationBehavior
  private _rulesValidating = ref(0)

  initialModelValue: unknown
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
    this._rules = rules.map(rule =>
      n_domain.isSimpleRule(rule) ? rule : rule.rule
    )
    this._buffers = rules.map(() => new n_domain.LinkedList())
    this._errors = reactive(rules.map(() => null))
    this._validationBehavior = validationBehavior

    this.name = name

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

  async validate(ruleNumber: number, modelValues: unknown[]) {
    const rule = this._rules[ruleNumber]
    const buffer = this._buffers[ruleNumber]
    let error: unknown

    if (!rule) {
      return
    }

    const ruleResult = rule(...modelValues.map(unref))

    if (typeof ruleResult?.then === 'function') {
      this._rulesValidating.value++
      const shouldSetError = buffer.addLast(true)

      if (shouldSetError.prev) {
        shouldSetError.prev.value = false
      }

      try {
        error = await ruleResult
      } catch (err) {
        error = err
      }

      buffer.remove(shouldSetError)
      this._rulesValidating.value--

      if (shouldSetError.value) {
        this._setError(ruleNumber, error)
      }
    } else {
      error = ruleResult
      this._setError(ruleNumber, error)
    }
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

    for (const buffer of this._buffers) {
      for (const shouldSetError of buffer.nodesForwards()) {
        shouldSetError.value = false
      }
    }

    Object.assign(
      this._errors,
      this._errors.map(() => null)
    )
  }

  dispose() {
    this.errors.effect.stop()
    this.validating.effect.stop()
    this.hasError.effect.stop()
  }

  private _setError(ruleNumber: any, error: unknown) {
    if (typeof error === 'string') {
      this._errors[ruleNumber] = error
      throw error
    } else {
      this._errors[ruleNumber] = null
    }
  }
}
