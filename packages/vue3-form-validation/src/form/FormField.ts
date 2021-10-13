import { computed, isReactive, isRef, reactive, ref, unref } from 'vue'
import { Form } from './Form'
import {
  ValidationBehavior,
  ValidationBehaviorRuleTupel
} from './types/validationBehavior'
import { SimpleRule } from './types/rules'
import { isSimpleRule } from './typeGuards'
import * as n_domain from '../domain'

export class FormField {
  private _rules: (SimpleRule | undefined)[]
  private _validationBehaviors: ValidationBehavior[]
  private _buffers: n_domain.LinkedList<boolean>[]
  private _errors: (string | null)[]
  private _rulesValidating = ref(0)

  initialModelValue: unknown
  name: string
  touched = false
  dirty = false
  modelValue: ReturnType<typeof ref> | ReturnType<typeof reactive>
  errors = computed(() => this._errors.filter(n_domain.isDefined))
  validating = computed(() => this._rulesValidating.value > 0)
  hasError = computed(() => this.errors.value.length > 0)

  constructor(
    name: string,
    modelValue: any,
    rules: ValidationBehaviorRuleTupel[]
  ) {
    this._rules = rules.map(([, rule]) =>
      isSimpleRule(rule) ? rule : rule.rule
    )
    this._validationBehaviors = rules.map(
      ([validationBehavior]) => validationBehavior
    )
    this._buffers = rules.map(() => new n_domain.LinkedList())
    this._errors = reactive(rules.map(() => null))

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

  async validate(
    ruleNumber: number,
    modelValues: unknown[],
    form: Form,
    force: boolean,
    submit: boolean
  ) {
    const rule = this._rules[ruleNumber]

    if (!rule) {
      return
    }

    const shouldValidate = this.getValidationBehavior(ruleNumber)({
      submitCount: form.submitCount.value,
      hasError: this._errors[ruleNumber] !== null,
      touched: this.touched,
      dirty: this.dirty,
      force,
      submit
    })

    if (!shouldValidate) {
      return
    }

    const buffer = this._buffers[ruleNumber]
    let error: unknown
    const ruleResult = rule(...modelValues.map(unref))

    if (typeof ruleResult?.then === 'function') {
      this._rulesValidating.value++
      form.ruleValidating.value++

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

      form.ruleValidating.value--
      this._rulesValidating.value--

      if (shouldSetError.value) {
        this._setError(ruleNumber, error)
      }
    } else {
      error = ruleResult
      this._setError(ruleNumber, error)
    }
  }

  reset(toDefaultValues: boolean) {
    this.touched = false
    this.dirty = false

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

  getValidationBehavior(ruleNumber: number) {
    return this._validationBehaviors[ruleNumber]
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
