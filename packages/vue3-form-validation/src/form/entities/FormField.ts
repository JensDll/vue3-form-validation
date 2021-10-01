import { computed, isReactive, isRef, reactive, ref, unref } from 'vue'
import { Rule } from '../../composition/useValidation'
import * as _ from '../../common'

export class FormField {
  _errors: (string | null)[]
  _initialModelValue: any
  _rulesValidating = ref(0)

  name: string
  touched = false
  dirty = false
  modelValue: ReturnType<typeof ref> | ReturnType<typeof reactive>
  errors = computed(() => this._errors.filter(_.isDefined))
  validating = computed(() => this._rulesValidating.value > 0)
  hasError = computed(() => this.errors.value.length > 0)

  constructor(name: string, modelValue: any, rules: Rule[]) {
    this.name = name
    this._errors = reactive(rules.map(() => null))

    if (isRef(modelValue) || isReactive(modelValue)) {
      this.modelValue = modelValue
      this._initialModelValue = _.deepCopy(unref(modelValue))
    } else if (_.isRecord(modelValue)) {
      this.modelValue = reactive(modelValue)
      this._initialModelValue = _.deepCopy(this.modelValue)
    } else {
      this.modelValue = ref(modelValue)
      this._initialModelValue = _.deepCopy(unref(modelValue))
    }
  }

  setError(ruleNumber: number, error: string | null) {
    this._errors[ruleNumber] = error
  }

  reset(toDefaultValues: boolean) {
    this.touched = false

    if (toDefaultValues) {
      if (isRef(this.modelValue)) {
        if (_.isArray(this.modelValue.value)) {
          this.modelValue.value = _.deepCopy(this._initialModelValue)
        } else {
          this.modelValue.value = this._initialModelValue
        }
      } else {
        const copy = _.deepCopy(this._initialModelValue)
        Object.assign(this.modelValue, copy)
      }
    }

    Object.assign(
      this._errors,
      this._errors.map(() => null)
    )
  }
}
