import { reactive, computed, ref, watch, WatchStopHandle, Ref } from 'vue'

import { Form, Validator, ValidatorNotDebounced } from './Form'
import { ValidationBehaviorFunction } from './validationBehavior'
import { SimpleRule, RuleInformation, unpackRule } from './rules'
import * as nDomain from '../domain'

class ResetError extends Error {}

type MappedRuleInformation = {
  promiseCancel: nDomain.PromiseCancel<never>
  rule?: SimpleRule
  validator: Validator
  validatorNotDebounced: ValidatorNotDebounced
  validationBehavior: ValidationBehaviorFunction
  cancelDebounce: () => void
}

export class FormField {
  watchStopHandle: WatchStopHandle
  form: Form
  ruleInfos: MappedRuleInformation[]
  rulesValidating = ref(0)
  initialModelValue: unknown

  uid: number
  name: string
  touched = ref(false)
  dirty = ref(false)
  modelValue: Ref<any>
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
    this.form = form
    this.uid = uid
    this.name = name
    this.modelValue = ref(modelValue)
    this.rawErrors = reactive(ruleInfos.map(() => null))
    this.initialModelValue = nDomain.deepCopy(this.modelValue.value)

    this.ruleInfos = ruleInfos.map((info, ruleNumber) => {
      let invokedTimes = 0
      const validator: Validator = info.debounce
        ? nDomain.debounce(
            modelValues => {
              this.validate(ruleNumber, modelValues, true)
              this.rulesValidating.value -= invokedTimes
              this.form.rulesValidating.value -= invokedTimes
              invokedTimes = 0
            },
            {
              wait: info.debounce,
              shouldInvoke: (modelValues, force, submit) => {
                if (this.shouldValidate(ruleNumber, force, submit) === true) {
                  invokedTimes++
                  this.rulesValidating.value++
                  this.form.rulesValidating.value++
                  return true
                }
              }
            }
          )
        : (modelValues, force, submit) => {
            if (this.shouldValidate(ruleNumber, force, submit) === true) {
              this.validate(ruleNumber, modelValues, true)
            }
          }

      const validatorNotDebounced: ValidatorNotDebounced = (
        modelValues,
        force,
        submit
      ) => {
        if (this.shouldValidate(ruleNumber, force, submit) === true) {
          return this.validate(ruleNumber, modelValues, false)
        }
      }

      return {
        promiseCancel: new nDomain.PromiseCancel(),
        rule: unpackRule(info.rule),
        validator,
        validatorNotDebounced,
        validationBehavior: info.validationBehavior,
        cancelDebounce: () => {
          invokedTimes = 0
          validator.cancel?.()
        }
      }
    })

    this.watchStopHandle = this.setupWatcher()
  }

  async validate(ruleNumber: number, modelValues: unknown[], noThrow: boolean) {
    const { rule, promiseCancel } = this.ruleInfos[ruleNumber]

    if (!rule) {
      return
    }

    let error: unknown
    const ruleResult = rule(...modelValues)

    promiseCancel.cancelReject(new nDomain.CancelError())

    if (typeof ruleResult?.then === 'function') {
      this.rulesValidating.value++
      this.form.rulesValidating.value++

      try {
        error = await promiseCancel.race(ruleResult)
      } catch (err) {
        if (err instanceof ResetError) {
          return
        }
        if (err instanceof nDomain.CancelError) {
          this.rulesValidating.value--
          this.form.rulesValidating.value--
          return
        }
        error = err
      } finally {
        promiseCancel.isRacing = false
      }

      this.rulesValidating.value--
      this.form.rulesValidating.value--
      this.setError(ruleNumber, error, noThrow)
    } else {
      error = ruleResult
      this.setError(ruleNumber, error, noThrow)
    }
  }

  reset(resetValue = this.initialModelValue) {
    this.watchStopHandle()
    this.touched.value = false
    this.dirty.value = false
    this.modelValue.value = nDomain.deepCopy(resetValue)
    this.rulesValidating.value = 0
    this.form.rulesValidating.value = 0

    for (let i = 0; i < this.ruleInfos.length; i++) {
      this.rawErrors[i] = null
      this.ruleInfos[i].cancelDebounce()
      this.ruleInfos[i].promiseCancel.cancelReject(new ResetError())
    }

    this.watchStopHandle = this.setupWatcher()
  }

  dispose() {
    this.errors.effect.stop()
    this.validating.effect.stop()
    this.hasError.effect.stop()
    this.watchStopHandle()
  }

  shouldValidate(ruleNumber: number, force: boolean, submit: boolean) {
    return this.ruleInfos[ruleNumber].validationBehavior({
      hasError: this.rawErrors[ruleNumber] !== null,
      touched: this.touched.value,
      dirty: this.dirty.value,
      force,
      submit,
      value: this.modelValue.value
    })
  }

  private setError(ruleNumber: any, error: unknown, noThrow: boolean) {
    if (typeof error === 'string') {
      this.rawErrors[ruleNumber] = error
      if (!noThrow) {
        throw error
      }
    } else {
      this.rawErrors[ruleNumber] = null
    }
  }

  private setupWatcher() {
    return watch(
      this.modelValue,
      () => {
        this.dirty.value = true
        this.form.validate(this.uid)
      },
      { deep: true }
    )
  }
}
