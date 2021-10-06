import { computed, ref, shallowReactive, unref } from 'vue'
import { FormField } from './FormField'
import { ValidationError } from './ValidationError'
import {
  ValidationBehavior,
  getMostRestrictiveValidationBehavior
} from './validationBehavior'
import * as n_domain from '../domain'

type ValidationResult = Promise<void | string>

type CurriedValidator = (
  formField: FormField,
  rule: Required<n_domain.KeyedRule>['rule'],
  ruleNumber: number
) => (modelValues: unknown[]) => ValidationResult

type Validator = ReturnType<CurriedValidator>

export type SimpleValidators = {
  validators: Validator[]
  meta: {
    formField: FormField
    keys: string[]
    rollbacks: (() => void)[]
  }
}

type KeyedValidator = {
  validator?: Validator
  meta: {
    formField: FormField
  }
}
export type KeyedValidators = Set<KeyedValidator>

export class Form {
  private _simpleValidators: Map<number, SimpleValidators> = new Map()
  private _keyedValidators: Map<string, KeyedValidators> = new Map()
  private _reactiveFormFieldMap: Map<number, FormField> = shallowReactive(
    new Map()
  )

  tryGetSimpleValidators = n_domain.tryGet(this._simpleValidators)
  trySetKeyedValidators = n_domain.trySet(this._keyedValidators)
  tryGetKeyedValidators = n_domain.tryGet(this._keyedValidators)

  submitCount = 0
  submitting = ref(false)
  errors = computed(() => {
    const errors: string[] = []

    for (const formField of this._reactiveFormFieldMap.values()) {
      errors.push(...formField.errors.value)
    }

    return errors
  })

  registerField(
    uid: number,
    name: string,
    modelValue: unknown,
    validationBehavior: ValidationBehavior,
    rules: n_domain.Rule[]
  ) {
    const formField = new FormField(name, modelValue, validationBehavior, rules)

    const simpleValidators: SimpleValidators = {
      validators: [],
      meta: {
        formField,
        keys: [],
        rollbacks: []
      }
    }

    rules.forEach((rule, ruleNumber) => {
      const validator = Form._validatorFactory(formField, rule, ruleNumber)

      if (n_domain.isSimpleRule(rule)) {
        if (validator !== undefined) {
          simpleValidators.validators.push(validator)
        }
      } else {
        const { key } = rule
        const keyedValidator: KeyedValidator = {
          validator,
          meta: {
            formField
          }
        }
        const rollback = () => {
          this.tryGetKeyedValidators({
            success: keyedValidators => {
              keyedValidators.delete(keyedValidator)
              if (keyedValidators.size === 0) {
                this._keyedValidators.delete(key)
              }
            }
          })(key)
        }

        simpleValidators.meta.keys.push(key)
        simpleValidators.meta.rollbacks.push(rollback)

        this.trySetKeyedValidators({
          failure: keyedValidators => keyedValidators.add(keyedValidator)
        })(key, new Set([keyedValidator]))
      }
    })

    this._simpleValidators.set(uid, simpleValidators)
    this._reactiveFormFieldMap.set(uid, formField)

    return formField
  }

  validate(uid: number, force = false) {
    const simpleValidators = this._simpleValidators.get(uid)

    if (simpleValidators) {
      const { validators, meta } = simpleValidators
      const shouldValidate = meta.formField.shouldValidate(this)

      if (force) {
        return Promise.allSettled([
          ...validators.map(v => v([meta.formField.modelValue])),
          ...this._getValidationResultsForKeys(meta.keys)
        ])
      }

      if (shouldValidate) {
        return Promise.allSettled([
          ...validators.map(v => v([meta.formField.modelValue])),
          ...this._getValidationResultsForKeys(meta.keys)
        ])
      }
    }
  }

  async validateAll(names?: readonly n_domain.Key[]) {
    this.submitCount++

    const settledResults = await Promise.allSettled(
      this._getValidationResultsForNames(names)
    )

    for (const result of settledResults) {
      if (result.status === 'rejected') {
        throw new ValidationError()
      }
    }
  }

  onDelete(uid: number) {
    this.tryGetSimpleValidators({
      success: ({ meta }) => {
        meta.rollbacks.forEach(r => r())
      }
    })(uid)

    this._simpleValidators.delete(uid)
    this._reactiveFormFieldMap.delete(uid)
  }

  resetFields(toDefaultValues: boolean) {
    for (const { meta } of this._simpleValidators.values()) {
      meta.formField.reset(toDefaultValues)
    }
  }

  private _getValidationResultsForKeys(
    keys: string[] | IterableIterator<string>
  ) {
    const validationResults: ValidationResult[] = []

    for (const key of keys) {
      this.tryGetKeyedValidators({
        success: keyedValidators => {
          if (this._shouldEveryFieldValidate(keyedValidators)) {
            const values = [...keyedValidators.values()]
            const modelValues = values.map(
              ({ meta }) => meta.formField.modelValue
            )
            const results = values
              .map(({ validator }) => validator)
              .filter(n_domain.isDefined)
              .map(validator => validator(modelValues))

            validationResults.push(...results)
          }
        }
      })(key)
    }

    return validationResults
  }

  private _getValidationResultsForNames(names?: readonly n_domain.Key[]) {
    const validationResults: ValidationResult[] = []

    if (names === undefined) {
      for (const { validators, meta } of this._simpleValidators.values()) {
        meta.formField.touched = true
        validationResults.push(
          ...validators.map(v => v([meta.formField.modelValue]))
        )
      }
      validationResults.push(
        ...this._getValidationResultsForKeys(this._keyedValidators.keys())
      )
    } else if (names.length > 0) {
      const uniqueNames = new Set(names)
      for (const { validators, meta } of this._simpleValidators.values()) {
        meta.formField.touched = true
        if (uniqueNames.has(meta.formField.name)) {
          validationResults.push(
            ...validators.map(v => v([meta.formField.modelValue]))
          )
          validationResults.push(
            ...this._getValidationResultsForKeys(meta.keys)
          )
        }
      }
    }

    return validationResults
  }

  private _shouldEveryFieldValidate(keyedValidators: KeyedValidators) {
    let shouldEveryFieldValidate = true
    const mostRestrictiveValidationBehavior =
      getMostRestrictiveValidationBehavior(this, keyedValidators)

    for (const { meta } of keyedValidators) {
      if (
        !meta.formField.shouldValidate(this, mostRestrictiveValidationBehavior)
      ) {
        shouldEveryFieldValidate = false
      }
    }

    return shouldEveryFieldValidate
  }

  private static _validatorFactory(
    formField: FormField,
    rule: n_domain.Rule,
    ruleNumber: number
  ): Validator | undefined {
    const buffer = new n_domain.LinkedList<boolean>()

    const setError = (
      formField: FormField,
      ruleNumber: number,
      error: unknown
    ) => {
      if (typeof error === 'string') {
        formField.setError(ruleNumber, error)
        throw error
      } else {
        formField.setError(ruleNumber, null)
      }
    }

    const curriedValidator: CurriedValidator =
      (formField, rule, ruleNumber) => async modelValues => {
        let error: unknown
        const ruleResult = rule(...modelValues.map(unref))

        if (typeof ruleResult?.then === 'function') {
          formField.increaseRulesValidating()
          const isLatest = buffer.addLast(true)

          if (isLatest.prev) {
            isLatest.prev.value = false
          }

          try {
            error = await ruleResult
          } catch (err) {
            error = err
          }

          buffer.remove(isLatest)
          formField.decreaseRulesValidating()

          // Is this the latest called rule? Then set the error
          if (isLatest.value) {
            setError(formField, ruleNumber, error)
          }
        } else {
          error = ruleResult
          setError(formField, ruleNumber, error)
        }
      }

    if (n_domain.isSimpleRule(rule)) {
      return curriedValidator(formField, rule, ruleNumber)
    } else if (rule.rule) {
      return curriedValidator(formField, rule.rule, ruleNumber)
    }
  }
}
