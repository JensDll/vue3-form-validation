import { computed, ref, shallowReactive } from 'vue'
import { FormField } from './FormField'
import { ValidationError } from './ValidationError'
import { RuleInformation } from './types/data'
import { isSimpleRule } from './typeGuards'
import * as n_domain from '../domain'

type ValidatorResult = Promise<void | string>

type Validator = (
  modelValues: unknown[],
  force: boolean,
  submit: boolean
) => ValidatorResult | void

type ValidatorNotDebounced = (
  modelValues: unknown[],
  force: boolean,
  submit: boolean
) => ValidatorResult

type SimpleValidators = {
  validators: Validator[]
  validatorsNotDebounced: ValidatorNotDebounced[]
  meta: {
    field: FormField
    keys: string[]
    rollbacks: (() => void)[]
  }
}

type KeyedValidator = {
  validator: Validator
  validatorNotDebounced: ValidatorNotDebounced
  meta: {
    field: FormField
  }
}

type KeyedValidators = Set<KeyedValidator>

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
    ruleInfos: RuleInformation[]
  ) {
    const field = new FormField(name, modelValue, ruleInfos)

    const simpleValidators: SimpleValidators = {
      validators: [],
      validatorsNotDebounced: [],
      meta: {
        field,
        keys: [],
        rollbacks: []
      }
    }

    ruleInfos.forEach(({ rule, debounce }, ruleNumber) => {
      const validatorNotDebounced: ValidatorNotDebounced = (
        modelValues,
        force,
        submit
      ) => field.validate(ruleNumber, modelValues, this, force, submit, false)

      let incrementedTimes = 0
      const validator: Validator = debounce
        ? n_domain.debounce(
            (modelValues, force, submit) => {
              field.validate(ruleNumber, modelValues, this, force, submit, true)
              field.rulesValidating.value -= incrementedTimes
              incrementedTimes = 0
            },
            {
              wait: debounce,
              sideEffect() {
                field.rulesValidating.value++
                incrementedTimes++
              }
            }
          )
        : (modelValues, force, submit) =>
            field.validate(ruleNumber, modelValues, this, force, submit, true)

      if (isSimpleRule(rule)) {
        simpleValidators.validators.push(validator)
        simpleValidators.validatorsNotDebounced.push(validatorNotDebounced)
      } else {
        const { key } = rule
        const keyedValidator: KeyedValidator = {
          validator,
          validatorNotDebounced,
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

    for (const validator of validators) {
      validator([meta.field.modelValue], force, false)
    }
    this._invokeValidatorsForKeys(meta.keys, force, false)
  }

  async validateAll(names?: readonly n_domain.Key[]) {
    this.submitCount.value++

    const settledResults = await Promise.allSettled(
      this._collectValidatorResultsForNames(names)
    )

    for (const result of settledResults) {
      if (result.status === 'rejected') {
        throw new ValidationError()
      }
    }
  }

  onDelete(uid: number): void {
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

  private _invokeValidatorsForKeys(
    keys: string[] | IterableIterator<string>,
    force: boolean,
    submit: boolean
  ): void {
    for (const key of keys) {
      const keyedValidators = this._keyedValidators.get(key)!
      if (this._isEveryFieldTouched(keyedValidators)) {
        const values = [...keyedValidators.values()]
        const modelValues = values.map(({ meta }) => meta.field.modelValue)
        for (const { validator } of values) {
          validator(modelValues, force, submit)
        }
      }
    }
  }

  private *_collectValidatorResultsForKeys(
    keys: string[] | IterableIterator<string>,
    force: boolean,
    submit: boolean
  ): Generator<ValidatorResult> {
    for (const key of keys) {
      const keyedValidators = this._keyedValidators.get(key)!
      const values = [...keyedValidators.values()]
      const modelValues = values.map(({ meta }) => meta.field.modelValue)
      for (const { validatorNotDebounced } of values) {
        yield validatorNotDebounced(modelValues, force, submit)
      }
    }
  }

  private *_collectValidatorResultsForNames(
    names?: readonly n_domain.Key[]
  ): Generator<ValidatorResult> {
    if (names === undefined) {
      for (const {
        validatorsNotDebounced,
        meta
      } of this._simpleValidators.values()) {
        meta.field.touched = true
        for (const validator of validatorsNotDebounced) {
          yield validator([meta.field.modelValue], false, true)
        }
      }
      yield* this._collectValidatorResultsForKeys(
        this._keyedValidators.keys(),
        false,
        true
      )
    } else if (names.length > 0) {
      const uniqueNames = new Set(names)

      for (const {
        validatorsNotDebounced,
        meta
      } of this._simpleValidators.values()) {
        if (uniqueNames.has(meta.field.name)) {
          meta.field.touched = true
          for (const validator of validatorsNotDebounced) {
            yield validator([meta.field.modelValue], false, true)
          }
          yield* this._collectValidatorResultsForKeys(
            this._keyedValidators.keys(),
            false,
            true
          )
        }
      }
    }
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
