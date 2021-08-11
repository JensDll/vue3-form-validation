import { computed, ref, shallowReactive, unref } from 'vue'
import { isDefined, LinkedList, tryGet, trySet } from '../common'
import { SimpleRule, Rule, KeyedRule } from '../composition/useValidation'
import { FormField } from './FormField'
import { ValidationError } from './ValidationError'

type ValidateResult = void | string

type Validator = (
  formField: FormField,
  rule: Required<KeyedRule>['rule'],
  ruleNumber: number
) => (modelValues: unknown[]) => Promise<ValidateResult>

type Validate = ReturnType<Validator>

type Simple = {
  formField: FormField
  keys: string[]
  vs: Validate[]
  rollbacks: (() => void)[]
}

type Keyed = {
  formField: FormField
  v?: Validate
}

const isSimpleRule = (rule: Rule): rule is SimpleRule =>
  typeof rule === 'function'

export class Form {
  private simpleMap: Map<number, Simple> = new Map()
  private keyedSetMap: Map<string, Set<Keyed>> = new Map()
  private reactiveFormFieldMap: Map<number, FormField> = shallowReactive(
    new Map()
  )

  private trySetKeyedSet = trySet(this.keyedSetMap)
  private tryGetKeyedSet = tryGet(this.keyedSetMap)
  private tryGetSimple = tryGet(this.simpleMap)

  formFields = ref(new Set<FormField>())
  submitting = ref(false)
  errors = computed(() => {
    const errors: string[] = []

    for (const formField of this.reactiveFormFieldMap.values()) {
      errors.push(...formField.errors.value)
    }

    return errors
  })

  registerField(uid: number, name: string, modelValue: unknown, rules: Rule[]) {
    const formField = new FormField(name, modelValue, rules)

    const simple: Simple = {
      formField,
      keys: [],
      vs: [],
      rollbacks: []
    }

    rules.forEach((rule, ruleNumber) => {
      const validate = Form.validateFactory(formField, rule, ruleNumber)

      if (isSimpleRule(rule)) {
        if (typeof validate !== 'undefined') {
          simple.vs.push(validate)
        }
      } else {
        const { key } = rule
        const keyed: Keyed = {
          formField,
          v: validate
        }
        const rollback = () => {
          this.tryGetKeyedSet({
            success: keyedSet => {
              keyedSet.delete(keyed)
              if (keyedSet.size === 0) {
                this.keyedSetMap.delete(key)
              }
            }
          })(key)
        }

        simple.keys.push(key)
        simple.rollbacks.push(rollback)

        this.trySetKeyedSet({
          failure: keyedSet => keyedSet.add(keyed)
        })(key, new Set([keyed]))
      }
    })

    this.simpleMap.set(uid, simple)
    this.reactiveFormFieldMap.set(uid, formField)

    this.formFields.value.add(formField)

    return formField
  }

  validate(uid: number) {
    const simple = this.simpleMap.get(uid)

    if (simple && simple.formField.touched) {
      return Promise.allSettled([
        ...simple.vs.map(v => v([simple.formField.modelValue])),
        ...this.getPromisesForKeys(simple.keys)
      ])
    }
  }

  async validateAll(names?: (string | number | symbol)[]) {
    const settledResults = await Promise.allSettled(
      this.getPromisesForNames(names)
    )

    for (const result of settledResults) {
      if (result.status === 'rejected') {
        throw new ValidationError()
      }
    }
  }

  onDelete(uid: number) {
    this.tryGetSimple({
      success: ({ rollbacks, formField }) => {
        this.formFields.value.delete(formField)
        rollbacks.forEach(r => r())
      }
    })(uid)

    this.simpleMap.delete(uid)
    this.reactiveFormFieldMap.delete(uid)
  }

  resetFields(toDefaultValues = true) {
    for (const { formField } of this.simpleMap.values()) {
      formField.reset(toDefaultValues)
    }
  }

  private getPromisesForKeys(keys: string[] | IterableIterator<string>) {
    const promises: Promise<ValidateResult>[] = []

    for (const key of keys) {
      this.tryGetKeyedSet({
        success: keyedSet => {
          if (this.isEveryFormFieldTouchedWith(key)) {
            const values = [...keyedSet.values()]
            const modelValues = values.map(
              ({ formField }) => formField.modelValue
            )
            const vs = values
              .map(({ v }) => v)
              .filter(isDefined)
              .map(v => v(modelValues))

            promises.push(...vs)
          }
        }
      })(key)
    }

    return promises
  }

  private getPromisesForNames(names?: (string | number | symbol)[]) {
    const promises: Promise<ValidateResult>[] = []

    if (typeof names === 'undefined') {
      for (const { formField, vs } of this.simpleMap.values()) {
        formField.touched = true
        promises.push(...vs.map(v => v([formField.modelValue])))
      }
      promises.push(...this.getPromisesForKeys(this.keyedSetMap.keys()))
    } else if (names.length > 0) {
      const nameSet = new Set(names)
      for (const { formField, keys, vs } of this.simpleMap.values()) {
        if (nameSet.has(formField.name)) {
          formField.touched = true
          promises.push(...vs.map(v => v([formField.modelValue])))
          promises.push(...this.getPromisesForKeys(keys))
        }
      }
    }

    return promises
  }

  private isEveryFormFieldTouchedWith(key: string) {
    let everyFormFieldIsTouched = true

    this.tryGetKeyedSet({
      success: keyedSet => {
        for (const { formField } of keyedSet) {
          if (!formField.touched) {
            everyFormFieldIsTouched = false
            break
          }
        }
      }
    })(key)

    return everyFormFieldIsTouched
  }

  private static validateFactory(
    formField: FormField,
    rule: Rule,
    ruleNumber: number
  ): Validate | undefined {
    const buffer = new LinkedList<boolean>()

    const setError = (
      formField: FormField,
      ruleNumber: number,
      error: unknown
    ) => {
      if (typeof error === 'string' && formField.touched) {
        formField.setError(ruleNumber, error)
        throw error
      } else {
        formField.setError(ruleNumber, null)
      }
    }

    const validator: Validator =
      (formField, rule, ruleNumber) => async modelValues => {
        let error: unknown
        const ruleResult = rule(...modelValues.map(unref))

        if (typeof ruleResult?.then === 'function') {
          formField.rulesValidating.value++

          const node = buffer.addLast(false)

          if (node.prev) {
            node.prev.value = true
          }

          try {
            error = await ruleResult
          } catch (err) {
            error = err
          }

          buffer.remove(node)
          formField.rulesValidating.value--

          if (!node.value) {
            setError(formField, ruleNumber, error)
          }
        } else {
          error = ruleResult
          setError(formField, ruleNumber, error)
        }
      }

    if (isSimpleRule(rule)) {
      return validator(formField, rule, ruleNumber)
    } else if (rule.rule) {
      return validator(formField, rule.rule, ruleNumber)
    }
  }
}
