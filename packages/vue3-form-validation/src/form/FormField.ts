import { computed, isReactive, isRef, reactive, ref, unref } from 'vue'
import { Form } from './Form'
import { ValidationBehavior } from './types/validationBehavior'
import { RuleInformation } from './types/data'
import { SimpleRule } from './types/rules'
import { isSimpleRule } from './typeGuards'
import * as n_domain from '../domain'

export class FormField {
  private _rules: (SimpleRule | undefined)[]
  private _validationBehaviors: ValidationBehavior[]
  private _buffers: n_domain.LinkedList<boolean>[]

  rulesValidating = ref(0)
  initialModelValue: unknown
  name: string
  touched = false
  dirty = false
  modelValue: ReturnType<typeof ref> | ReturnType<typeof reactive>
  rawErrors: (string | null)[]
  errors = computed(() => this.rawErrors.filter(n_domain.isDefined))
  validating = computed(() => this.rulesValidating.value > 0)
  hasError = computed(() => this.errors.value.length > 0)

  constructor(name: string, modelValue: any, ruleInfos: RuleInformation[]) {
    this._rules = ruleInfos.map(({ rule }) =>
      isSimpleRule(rule) ? rule : rule.rule
    )
    this._validationBehaviors = ruleInfos.map(info => info.validationBehavior)
    this._buffers = ruleInfos.map(() => new n_domain.LinkedList())
    this.rawErrors = reactive(ruleInfos.map(() => null))

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
    submit: boolean,
    noThrow: boolean
  ) {
    const rule = this._rules[ruleNumber]

    if (!rule) {
      return
    }

    const shouldValidate = this.getValidationBehavior(ruleNumber)({
      submitCount: form.submitCount.value,
      hasError: this.rawErrors[ruleNumber] !== null,
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
      this.rulesValidating.value++
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
      this.rulesValidating.value--

      if (shouldSetError.value) {
        this._setError(ruleNumber, error, noThrow)
      }
    } else {
      error = ruleResult
      this._setError(ruleNumber, error, noThrow)
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
      this.rawErrors,
      this.rawErrors.map(() => null)
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

  private _setError(ruleNumber: any, error: unknown, noThrow: boolean) {
    if (typeof error === 'string') {
      this.rawErrors[ruleNumber] = error
      if (!noThrow) {
        throw error
      }
    } else {
      this.rawErrors[ruleNumber] = null
    }
  }
}
