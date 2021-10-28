import { computed, reactive, ref, unref, watch, WatchStopHandle } from 'vue'
import { Form } from './Form'
import { ValidationBehaviorFunction } from './validationBehavior'
import { isSimpleRule, SimpleRule, RuleInformation } from './rules'
import * as nDomain from '../domain'

export class FormField {
  private _rules: (SimpleRule | undefined)[]
  private _validationBehaviors: ValidationBehaviorFunction[]
  private _buffers: nDomain.LinkedList<boolean>[]
  private _watchStopHandle: WatchStopHandle
  private _form: Form

  uid: number
  rulesValidating = ref(0)
  initialModelValue: unknown
  name: string
  touched = ref(false)
  dirty = ref(false)
  modelValue: nDomain.ControlledRef<any>
  rawErrors: (string | null)[]
  errors = computed(() => this.rawErrors.filter(nDomain.isDefined))
  validating = computed(() => this.rulesValidating.value > 0)
  hasError = computed(() => this.errors.value.length > 0)

  constructor(
    form: Form,
    uid: number,
    name: string,
    modelValue: any,
    ruleInfos: RuleInformation[]
  ) {
    this._rules = ruleInfos.map(({ rule }) =>
      isSimpleRule(rule) ? rule : rule.rule
    )
    this._validationBehaviors = ruleInfos.map(info => info.validationBehavior)
    this._buffers = ruleInfos.map(() => new nDomain.LinkedList())
    this._form = form

    this.rawErrors = reactive(ruleInfos.map(() => null))
    this.name = name
    this.uid = uid
    this.modelValue = nDomain.controlledRef(modelValue)
    this.initialModelValue = nDomain.deepCopy(this.modelValue.value)

    this._watchStopHandle = watch(
      this.modelValue,
      () => {
        this.dirty.value = true
        this._form.validate(this.uid)
      },
      { deep: true }
    )
  }

  async validate(ruleNumber: number, modelValues: unknown[], noThrow: boolean) {
    const rule = this._rules[ruleNumber]

    if (!rule) {
      return
    }

    const buffer = this._buffers[ruleNumber]
    let error: unknown
    const ruleResult = rule(...modelValues)

    const shouldSetError = buffer.addLast(true)

    if (shouldSetError.prev) {
      shouldSetError.prev.value = false
      this.rulesValidating.value--
      this._form.rulesValidating.value--
    }

    if (typeof ruleResult?.then === 'function') {
      this.rulesValidating.value++
      this._form.rulesValidating.value++

      try {
        error = await ruleResult
      } catch (err) {
        error = err
      }

      buffer.remove(shouldSetError)

      if (shouldSetError.value) {
        this.rulesValidating.value--
        this._form.rulesValidating.value--
        this._setError(ruleNumber, error, noThrow)
      }
    } else {
      buffer.removeLast()
      error = ruleResult
      this._setError(ruleNumber, error, noThrow)
    }
  }

  reset(resetValue = this.initialModelValue) {
    this.touched.value = false
    this.dirty.value = false
    this.modelValue.silentSet(nDomain.deepCopy(resetValue))
    this.rulesValidating.value = 0
    this._form.rulesValidating.value = 0

    for (const buffer of this._buffers) {
      for (const shouldSetError of buffer.nodesForwards()) {
        shouldSetError.value = false
      }
    }

    for (let i = 0; i < this.rawErrors.length; i++) {
      this.rawErrors[i] = null
    }
  }

  dispose() {
    this.errors.effect.stop()
    this.validating.effect.stop()
    this.hasError.effect.stop()
    this._watchStopHandle()
  }

  shouldValidate(ruleNumber: number, force: boolean, submit: boolean) {
    return this._validationBehaviors[ruleNumber]({
      hasError: this.rawErrors[ruleNumber] !== null,
      touched: this.touched.value,
      dirty: this.dirty.value,
      force,
      submit,
      value: unref(this.modelValue)
    })
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
