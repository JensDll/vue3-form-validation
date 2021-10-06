import { computed, ref, shallowReactive } from 'vue'
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
  validator: Validator
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
      const validator = Form._validatorFactory(formField, ruleNumber)

      if (n_domain.isSimpleRule(rule)) {
        simpleValidators.validators.push(validator)
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
            validationResults.push(
              ...values.map(({ validator }) => validator(modelValues))
            )
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
    ruleNumber: number
  ): Validator {
    const curriedValidator: CurriedValidator =
      (formField, ruleNumber) => modelValues => {
        return formField.validate(ruleNumber, modelValues)
      }

    return curriedValidator(formField, ruleNumber)
  }
}
