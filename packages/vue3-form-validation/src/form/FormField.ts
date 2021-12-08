import { reactive, computed, ref, watch, WatchStopHandle, Ref } from 'vue'

import { Form, Validator, ValidatorParameters } from './Form'
import { ValidationBehaviorFunction } from './validationBehavior'
import { SimpleRule, RuleInformation, unpackRule } from './rules'
import * as nDomain from '../domain'

class ResetError extends Error {}

type MappedRuleInformation = {
  promiseCancel: nDomain.PromiseCancel<never>
  rule?: SimpleRule
  validator: Validator
  validatorNotDebounced: Validator
  validationBehavior: ValidationBehaviorFunction
  cancelDebounce: () => void
}

type DebouncedValidator = nDomain.Debounced<ValidatorParameters>

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
      let validator: Validator

      let debouncedValidator: DebouncedValidator
      let debounceInvokedTimes = 0
      let debounceResolve: (value: void | PromiseLike<void>) => void

      if (info.debounce) {
        debouncedValidator = nDomain.debounce(
          modelValues => {
            debounceResolve(this.validate(ruleNumber, modelValues))
            this.rulesValidating.value -= debounceInvokedTimes
            this.form.rulesValidating.value -= debounceInvokedTimes
            debounceInvokedTimes = 0
          },
          {
            wait: info.debounce
          }
        )

        validator = (modelValues, force, submit) => {
          if (this.shouldValidate(ruleNumber, force, submit) === true) {
            debounceInvokedTimes++
            this.rulesValidating.value++
            this.form.rulesValidating.value++

            return new Promise(resolve => {
              debounceResolve = resolve
              debouncedValidator(modelValues, force, submit)
            })
          }
        }
      } else {
        validator = (modelValues, force, submit) => {
          if (this.shouldValidate(ruleNumber, force, submit) === true) {
            return this.validate(ruleNumber, modelValues)
          }
        }
      }

      const validatorNotDebounced: Validator = (modelValues, force, submit) => {
        if (this.shouldValidate(ruleNumber, force, submit) === true) {
          return this.validate(ruleNumber, modelValues)
        }
      }

      return {
        promiseCancel: new nDomain.PromiseCancel(),
        rule: unpackRule(info.rule),
        validator,
        validatorNotDebounced,
        validationBehavior: info.validationBehavior,
        cancelDebounce: () => {
          if (debouncedValidator) {
            debounceInvokedTimes = 0
            debouncedValidator.cancel()
            debounceResolve?.()
          }
        }
      }
    })

    this.watchStopHandle = this.setupWatcher()
  }

  async validate(ruleNumber: number, modelValues: unknown[]) {
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
      this.setError(ruleNumber, error)
    } else {
      error = ruleResult
      this.setError(ruleNumber, error)
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

  private setError(ruleNumber: any, error: unknown) {
    if (typeof error === 'string') {
      this.rawErrors[ruleNumber] = error
      throw error
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
