import {
  reactive,
  computed,
  ref,
  watch,
  WatchStopHandle,
  Ref,
  isVue3
} from 'vue-demi'

import { Form, Validator, ValidatorParameters } from './Form'
import { ValidationBehaviorFunction } from './validationBehavior'
import { SimpleRule, RuleInformation, unpackRule } from './rules'
import * as nShared from '@compose-validation/shared'

type MappedRuleInformation = {
  buffer: nShared.LinkedList<boolean>
  rule?: SimpleRule
  validator: Validator
  validatorNotDebounced: Validator
  validationBehavior: ValidationBehaviorFunction
  cancelDebounce: () => void
}

type DebouncedValidator = nShared.Debounced<ValidatorParameters>

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
  errors = computed(() => this.rawErrors.filter(nShared.isDefined))
  validating = computed(() => this.rulesValidating.value > 0)
  hasError = computed(() => this.errors.value.length > 0)
  hasErrors: boolean[]

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
    this.hasErrors = reactive(ruleInfos.map(() => false))
    this.initialModelValue = nShared.deepCopy(this.modelValue.value)

    this.ruleInfos = ruleInfos.map((info, ruleNumber) => {
      let validator: Validator
      const validatorNotDebounced: Validator = (modelValues, force, submit) => {
        if (this.shouldValidate(ruleNumber, force, submit) === true) {
          return this.validate(ruleNumber, modelValues)
        }
      }

      let debouncedValidator: DebouncedValidator
      let debounceInvokedTimes = 0
      let debounceResolve: (value: void | PromiseLike<void>) => void

      if (info.debounce) {
        debouncedValidator = nShared.debounce(
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
              debounceResolve?.()
              debounceResolve = resolve
              debouncedValidator(modelValues, force, submit)
            })
          }
        }
      } else {
        validator = validatorNotDebounced
      }

      return {
        buffer: new nShared.LinkedList(),
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
    const { rule, buffer } = this.ruleInfos[ruleNumber]

    if (!rule) {
      return
    }

    let error: unknown
    const ruleResult = rule(...modelValues)

    if (buffer.last?.value) {
      buffer.last.value = false
      this.rulesValidating.value--
      this.form.rulesValidating.value--
    }

    if (typeof ruleResult?.then === 'function') {
      const shouldSetError = buffer.addLast(true)

      this.rulesValidating.value++
      this.form.rulesValidating.value++

      try {
        error = await ruleResult
      } catch (err) {
        error = err
      }

      buffer.remove(shouldSetError)

      if (shouldSetError.value) {
        this.rulesValidating.value--
        this.form.rulesValidating.value--
        this.setError(ruleNumber, error)
      } else {
        /**
         * This branch is reached in one of two cases:
         * 1. While this rule was validating the same async rule was invoked again.
         * 2. While this rule was validating the field was reset.
         *
         * In both cases, no error is to be set but the promise should still reject
         * if the rule returns a string.
         */
        if (typeof error === 'string') {
          throw error
        }
      }
    } else {
      error = ruleResult
      this.setError(ruleNumber, error)
    }
  }

  reset(resetValue = this.initialModelValue) {
    this.watchStopHandle()
    this.touched.value = false
    this.dirty.value = false
    this.modelValue.value = nShared.deepCopy(resetValue)
    this.rulesValidating.value = 0
    this.form.rulesValidating.value = 0

    for (let i = 0; i < this.ruleInfos.length; i++) {
      this.rawErrors[i] = null
      this.ruleInfos[i].cancelDebounce()
      for (const shouldSetError of this.ruleInfos[i].buffer.nodesForwards()) {
        shouldSetError.value = false
      }
    }

    this.watchStopHandle = this.setupWatcher()
  }

  dispose() {
    if (isVue3) {
      // @ts-ignore
      this.errors.effect.stop()
      // @ts-ignore
      this.validating.effect.stop()
      // @ts-ignore
      this.hasError.effect.stop()
    }
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
      this.hasErrors[ruleNumber] = true
      throw error
    } else {
      this.rawErrors[ruleNumber] = null
      this.hasErrors[ruleNumber] = false
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
