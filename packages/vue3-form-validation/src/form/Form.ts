import { computed, ref, shallowReactive } from 'vue'

import { FormField } from './FormField'
import { ValidationError } from './ValidationError'
import { isSimpleRule, RuleInformation } from './rules'
import * as nDomain from '../domain'

export type ValidatorParameters = [
  /**
   * Type definition is not accurate here but catches invalid use of validators.
   * The accurate type would be an array of anything expect Refs.
   */
  modelValues: (string | number | Record<string, unknown>)[],
  force: boolean,
  submit: boolean
]
export type ValidatorReturn = Promise<void> | void
export type Validator = (...params: ValidatorParameters) => ValidatorReturn

type SimpleValidators = {
  validators: Validator[]
  validatorsNotDebounced: Validator[]
  meta: {
    field: FormField
    keys: string[]
    rollbacks: (() => void)[]
  }
}

type KeyedValidator = {
  validator: Validator
  validatorNotDebounced: Validator
  meta: {
    field: FormField
  }
}

type KeyedValidators = Set<KeyedValidator>

export class Form {
  simpleValidators: Map<number, SimpleValidators> = new Map()
  keyedValidators: Map<string, KeyedValidators> = new Map()
  reactiveFields: Map<number, FormField> = shallowReactive(new Map())

  tryGetSimpleValidators = nDomain.tryGet(this.simpleValidators)
  trySetKeyedValidators = nDomain.trySet(this.keyedValidators)
  tryGetKeyedValidators = nDomain.tryGet(this.keyedValidators)

  rulesValidating = ref(0)
  submitting = ref(false)
  validating = computed(() => this.rulesValidating.value > 0)
  hasError = computed(() => this.errors.value.length > 0)
  errors = computed(() => {
    const errors: string[] = []

    for (const field of this.reactiveFields.values()) {
      errors.push(...field.errors.value)
    }

    return errors
  })

  registerField(
    uid: number,
    name: string,
    modelValue: unknown,
    ruleInfos: RuleInformation[]
  ) {
    const field = new FormField(this, uid, name, modelValue, ruleInfos)

    const simpleValidators: SimpleValidators = {
      validators: [],
      validatorsNotDebounced: [],
      meta: {
        field,
        keys: [],
        rollbacks: []
      }
    }

    ruleInfos.forEach(({ rule }, ruleNumber) => {
      const validator = field.ruleInfos[ruleNumber].validator
      const validatorNotDebounced =
        field.ruleInfos[ruleNumber].validatorNotDebounced

      if (isSimpleRule(rule)) {
        simpleValidators.validators.push(validator)
        simpleValidators.validatorsNotDebounced.push(validatorNotDebounced)
      } else {
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
                this.keyedValidators.delete(rule.key)
              }
            }
          })(rule.key)
        }

        simpleValidators.meta.keys.push(rule.key)
        simpleValidators.meta.rollbacks.push(rollback)

        this.trySetKeyedValidators({
          failure: keyedValidators => keyedValidators.add(keyedValidator)
        })(rule.key, new Set([keyedValidator]))
      }
    })

    this.simpleValidators.set(uid, simpleValidators)
    this.reactiveFields.set(uid, field)

    return field
  }

  validate(uid: number, force = false): Promise<PromiseSettledResult<void>[]> {
    const { validators, meta } = this.simpleValidators.get(uid)!

    return Promise.allSettled([
      ...validators.map(validator =>
        validator([meta.field.modelValue.value], force, false)
      ),
      ...this.collectValidatorResultsForKeysDebounced(meta.keys, force)
    ])
  }

  async validateAll(names?: readonly nDomain.Key[]): Promise<void> {
    const settledResults = await Promise.allSettled(
      this.collectValidatorResultsForNames(names)
    )

    for (const result of settledResults) {
      if (result.status === 'rejected') {
        throw new ValidationError()
      }
    }
  }

  dispose(uid: number): void {
    this.tryGetSimpleValidators({
      success: ({ meta }) => {
        meta.field.dispose()
        meta.rollbacks.forEach(r => r())
      }
    })(uid)

    this.simpleValidators.delete(uid)
    this.reactiveFields.delete(uid)
  }

  resetFields(): void {
    for (const { meta } of this.simpleValidators.values()) {
      meta.field.reset()
    }
  }

  getField(uid: number): FormField | undefined {
    const simpleValidators = this.simpleValidators.get(uid)
    if (simpleValidators) {
      return simpleValidators.meta.field
    }
  }

  /**
   * Should only be called from `validateAll`
   * (`force` and `submit` will default to `false` and `true`).
   *
   * @param keys The keys of the rules to validate
   */
  private *collectValidatorResultsForKeys(
    keys: string[] | Iterable<string>
  ): Generator<ValidatorReturn> {
    for (const key of keys) {
      const keyedValidators = this.keyedValidators.get(key)!
      const values = [...keyedValidators.values()]
      const modelValues = values.map(({ meta }) => meta.field.modelValue.value)
      for (const { validatorNotDebounced } of values) {
        yield validatorNotDebounced(modelValues, false, true)
      }
    }
  }

  /**
   * Should only be called from `validate`
   * (`submit` will default to `false`).
   * It will also check if every field of a key is touched before
   * invoking the validator and not use the debounced version.
   *
   * @param keys The keys of the rules to validate
   */
  private *collectValidatorResultsForKeysDebounced(
    keys: string[] | Iterable<string>,
    force: boolean
  ): Generator<ValidatorReturn> {
    for (const key of keys) {
      const keyedValidators = this.keyedValidators.get(key)!
      if (this.isEveryFieldTouched(keyedValidators)) {
        const values = [...keyedValidators.values()]
        const modelValues = values.map(
          ({ meta }) => meta.field.modelValue.value
        )
        for (const { validator } of values) {
          yield validator(modelValues, force, false)
        }
      }
    }
  }

  private *collectValidatorResultsForNames(
    names?: readonly nDomain.Key[]
  ): Generator<ValidatorReturn> {
    if (names === undefined) {
      for (const {
        validatorsNotDebounced,
        meta
      } of this.simpleValidators.values()) {
        meta.field.touched.value = true
        for (const validator of validatorsNotDebounced) {
          yield validator([meta.field.modelValue.value], false, true)
        }
      }
      yield* this.collectValidatorResultsForKeys(this.keyedValidators.keys())
    } else if (names.length > 0) {
      const uniqueNames = new Set(names)

      for (const {
        validatorsNotDebounced,
        meta
      } of this.simpleValidators.values()) {
        if (uniqueNames.has(meta.field.name)) {
          meta.field.touched.value = true
          for (const validator of validatorsNotDebounced) {
            yield validator([meta.field.modelValue.value], false, true)
          }
          yield* this.collectValidatorResultsForKeys(
            this.keyedValidators.keys()
          )
        }
      }
    }
  }

  private isEveryFieldTouched(keyedValidators: KeyedValidators): boolean {
    for (const { meta } of keyedValidators) {
      if (!meta.field.touched.value) {
        return false
      }
    }

    return true
  }
}
