import { reactive, computed, ref, watch, WatchStopHandle, Ref } from 'vue'

import { Form, Validator, ValidatorNotDebounced } from './Form'
import { ValidationBehaviorFunction } from './validationBehavior'
import { SimpleRule, RuleInformation, unpackRule } from './rules'
import * as nDomain from '../domain'

class ResetError extends Error {}

export class FormField {
  watchStopHandle: WatchStopHandle
  form: Form
  promiseCancels: nDomain.PromiseCancel<never>[]
  rules: (SimpleRule | undefined)[]
  validators: Validator[]
  validatorsNotDebounced: ValidatorNotDebounced[]
  validationBehaviors: ValidationBehaviorFunction[]
  cancelDebounce: (() => void)[]
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
    this.promiseCancels = new Array(ruleInfos.length)
    this.rules = new Array(ruleInfos.length)
    this.validationBehaviors = new Array(ruleInfos.length)
    this.validators = new Array(ruleInfos.length)
    this.validatorsNotDebounced = new Array(ruleInfos.length)
    this.rawErrors = new Array(ruleInfos.length)
    this.cancelDebounce = new Array(ruleInfos.length)
    this.uid = uid
    this.name = name
    this.modelValue = ref(modelValue)
    this.initialModelValue = nDomain.deepCopy(this.modelValue.value)

    ruleInfos.forEach((info, ruleNumber) => {
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

      this.promiseCancels[ruleNumber] = new nDomain.PromiseCancel()
      this.rules[ruleNumber] = unpackRule(info.rule)
      this.validationBehaviors[ruleNumber] = info.validationBehavior
      this.validators[ruleNumber] = validator
      this.validatorsNotDebounced[ruleNumber] = validatorNotDebounced
      this.rawErrors[ruleNumber] = null
      this.cancelDebounce[ruleNumber] = () => {
        invokedTimes = 0
        validator.cancel?.()
      }
    })

    this.rawErrors = reactive(this.rawErrors)

    this.watchStopHandle = this.setupWatcher()
  }

  async validate(ruleNumber: number, modelValues: unknown[], noThrow: boolean) {
    const rule = this.rules[ruleNumber]

    if (!rule) {
      return
    }

    const promiseCancel = this.promiseCancels[ruleNumber]
    let error: unknown
    const ruleResult = rule(...modelValues)

    if (promiseCancel.isRacing) {
      promiseCancel.cancelReject(new nDomain.CancelError())
    }

    if (typeof ruleResult?.then === 'function') {
      this.rulesValidating.value++
      this.form.rulesValidating.value++

      try {
        error = await promiseCancel.raceSingle(ruleResult)
      } catch (err: any) {
        switch (err.constructor) {
          case ResetError:
            return
          case nDomain.CancelError:
            this.rulesValidating.value--
            this.form.rulesValidating.value--
            return
          default:
            error = err
        }
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

    for (const promiseCancel of this.promiseCancels) {
      if (promiseCancel.isRacing) {
        promiseCancel.cancelReject(new ResetError())
      }
    }

    for (let i = 0; i < this.rules.length; i++) {
      this.rawErrors[i] = null
      this.cancelDebounce[i]()
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
    return this.validationBehaviors[ruleNumber]({
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
