import { computed, ref, shallowReactive } from 'vue'
import { FormField } from './FormField'
import { ValidationError } from './ValidationError'
import { ValidationBehaviorRuleTupel } from './types/validationBehavior'
import { isSimpleRule } from './typeGuards'
import * as n_domain from '../domain'

type ValidationResult = Promise<void | string>

type Validator = (
  modelValues: unknown[],
  force: boolean,
  submit: boolean
) => ValidationResult

export type SimpleValidators = {
  validators: Validator[]
  meta: {
    field: FormField
    keys: string[]
    rollbacks: (() => void)[]
  }
}

type KeyedValidator = {
  validator: Validator
  meta: {
    field: FormField
  }
}

export type KeyedValidators = Set<KeyedValidator>

export class Form {
  private _simpleValidators: Map<number, SimpleValidators> = new Map()
  private _keyedValidators: Map<string, KeyedValidators> = new Map()
  private _reactiveFieldMap: Map<number, FormField> = shallowReactive(new Map())

  tryGetSimpleValidators = n_domain.tryGet(this._simpleValidators)
  trySetKeyedValidators = n_domain.trySet(this._keyedValidators)
  tryGetKeyedValidators = n_domain.tryGet(this._keyedValidators)

  ruleValidating = ref(0)
  submitCount = ref(0)
  submitting = ref(false)
  validating = computed(() => this.ruleValidating.value > 0)
  hasError = computed(() => this.errors.value.length > 0)
  errors = computed(() => {
    const errors: string[] = []

    for (const formField of this._reactiveFieldMap.values()) {
      errors.push(...formField.errors.value)
    }

    return errors
  })

  registerField(
    uid: number,
    name: string,
    modelValue: unknown,
    rules: ValidationBehaviorRuleTupel[]
  ) {
    const field = new FormField(name, modelValue, rules)

    const simpleValidators: SimpleValidators = {
      validators: [],
      meta: {
        field,
        keys: [],
        rollbacks: []
      }
    }

    rules.forEach(([, rule], ruleNumber) => {
      const validator: Validator = (modelValues, force, submit) =>
        field.validate(ruleNumber, modelValues, this, force, submit)

      if (isSimpleRule(rule)) {
        simpleValidators.validators.push(validator)
      } else {
        const { key } = rule
        const keyedValidator: KeyedValidator = {
          validator,
          meta: {
            field
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
    this._reactiveFieldMap.set(uid, field)

    return field
  }

  validate(uid: number, force = false) {
    const simpleValidators = this._simpleValidators.get(uid)!

    const { validators, meta } = simpleValidators

    return Promise.allSettled([
      ...validators.map(v => v([meta.field.modelValue], force, false)),
      ...this._getValidationResultsForKeys(meta.keys, force, false)
    ])
  }

  async validateAll(names?: readonly n_domain.Key[]) {
    this.submitCount.value++

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
    this._reactiveFieldMap.delete(uid)
  }

  resetFields(toDefaultValues: boolean) {
    for (const { meta } of this._simpleValidators.values()) {
      meta.field.reset(toDefaultValues)
    }
  }

  private _getValidationResultsForKeys(
    keys: string[] | IterableIterator<string>,
    force: boolean,
    submit: boolean,
    skipTouchedCheck = false
  ) {
    const validationResults: ValidationResult[] = []

    for (const key of keys) {
      const keyedValidators = this._keyedValidators.get(key)!
      if (skipTouchedCheck || this._isEveryFieldTouched(keyedValidators)) {
        const values = [...keyedValidators.values()]
        const modelValues = values.map(({ meta }) => meta.field.modelValue)
        validationResults.push(
          ...values.map(({ validator }) =>
            validator(modelValues, force, submit)
          )
        )
      }
    }

    return validationResults
  }

  private _getValidationResultsForNames(names?: readonly n_domain.Key[]) {
    const validationResults: ValidationResult[] = []

    if (names === undefined) {
      for (const { validators, meta } of this._simpleValidators.values()) {
        meta.field.touched = true
        validationResults.push(
          ...validators.map(v => v([meta.field.modelValue], true, true))
        )
      }
      validationResults.push(
        ...this._getValidationResultsForKeys(
          this._keyedValidators.keys(),
          true,
          true,
          true
        )
      )
    } else if (names.length > 0) {
      const uniqueNames = new Set(names)
      for (const { validators, meta } of this._simpleValidators.values()) {
        meta.field.touched = true
        if (uniqueNames.has(meta.field.name)) {
          validationResults.push(
            ...validators.map(v => v([meta.field.modelValue], true, true))
          )
          validationResults.push(
            ...this._getValidationResultsForKeys(meta.keys, true, true, true)
          )
        }
      }
    }

    return validationResults
  }

  private _isEveryFieldTouched(keyedValidators: KeyedValidators) {
    for (const { meta } of keyedValidators) {
      if (!meta.field.touched) {
        return false
      }
    }

    return true
  }
}
