import { computed, reactive, ref, unref } from 'vue';
import { LinkedList, tryGet, trySet } from '../common';
import { SimpleRule, Rule } from '../composition/useValidation';
import { FormField } from './FormField';

type ValidateResult = void | string;

type Validator = (
  formField: FormField,
  rule: SimpleRule,
  ruleNumber: number
) => () => Promise<ValidateResult>;

type Validate = ReturnType<Validator>;

type Simple = {
  formField: FormField;
  keys: string[];
  validators: Validate[];
  rollback: (() => void)[];
};

type Keyed = Set<{
  formField: FormField;
  validator: Validate;
}>;

const isSimpleRule = (rule: Rule): rule is SimpleRule =>
  typeof rule === 'function';

export class Form {
  private simpleMap: Map<number, Simple> = new Map();
  private keyedMap: Map<string, Keyed> = new Map();
  private reactiveFormFieldMap: Map<number, FormField> = reactive(new Map());

  private trySetKeyed = trySet(this.keyedMap);
  private tryGetKeyed = tryGet(this.keyedMap);
  private tryGetSimple = tryGet(this.simpleMap);

  submitting = ref(false);

  registerField(uid: number, rules: Rule[], modelValue?: unknown) {
    const formField = new FormField(rules, modelValue);

    const simple = rules.reduce<Simple>(
      (simpleEntry, rule, ruleNumber) => {
        const validate = Form.validateFactory(formField, rule, ruleNumber);

        if (validate) {
          if (isSimpleRule(rule)) {
            simpleEntry.validators.push(validate);
          } else {
            const entry = { formField, validator: validate };

            simpleEntry.keys.push(rule.key);

            this.trySetKeyed({
              failure: keyed => keyed.add(entry)
            })(rule.key, new Set([entry]));

            simpleEntry.rollback.push(() => {
              this.tryGetKeyed({
                success: keyed => {
                  keyed.delete(entry);

                  if (!keyed.size) {
                    this.keyedMap.delete(rule.key);
                  }
                }
              })(rule.key);
            });
          }
        }

        return simpleEntry;
      },
      {
        formField,
        keys: [],
        validators: [],
        rollback: []
      }
    );

    this.simpleMap.set(uid, simple);
    this.reactiveFormFieldMap.set(uid, formField);

    return formField;
  }

  getErrors() {
    return computed(() => {
      const errors: string[] = [];

      for (const formField of this.reactiveFormFieldMap.values()) {
        errors.push(...formField.getErrors().value);
      }

      return errors;
    });
  }

  resetFields(toDefaultValues = true) {
    for (const { formField } of this.simpleMap.values()) {
      formField.reset(toDefaultValues);
    }
  }

  async validateAll() {
    const promises = [];

    for (const { formField, validators } of this.simpleMap.values()) {
      formField.touched = true;
      promises.push(...validators.map(v => v()));
    }

    for (const keyed of this.keyedMap.values()) {
      for (const { validator } of keyed) {
        promises.push(validator());
      }
    }

    const settledResults = await Promise.allSettled(promises);

    for (const result of settledResults) {
      if (result.status === 'rejected') {
        return true;
      }
    }

    return false;
  }

  validate(uid: number) {
    let promise: Promise<PromiseSettledResult<ValidateResult>[]> =
      Promise.allSettled([] as void[]);

    this.tryGetSimple({
      success: ({ formField, keys, validators }) => {
        if (formField.touched) {
          promise = Promise.allSettled([
            ...validators.map(v => v()),
            ...this.getPromisesFor(keys)
          ]);
        }
      }
    })(uid);

    return promise;
  }

  onDelete(uid: number) {
    this.tryGetSimple({
      success({ rollback }) {
        rollback.forEach(r => r());
      }
    })(uid);

    this.simpleMap.delete(uid);
    this.reactiveFormFieldMap.delete(uid);
  }

  private getPromisesFor(keys: string[]) {
    return keys.reduce((promises, key) => {
      this.tryGetKeyed({
        success: keyed => {
          if (this.isEveryFormFieldTouchedWith(key)) {
            promises.push(
              ...[...keyed.values()].map(({ validator }) => validator())
            );
          }
        }
      })(key);

      return promises;
    }, [] as Promise<ValidateResult>[]);
  }

  private isEveryFormFieldTouchedWith(key: string) {
    let everyFormFieldIsTouched = true;

    this.tryGetKeyed({
      success: keyed => {
        for (const { formField } of keyed) {
          if (!formField.touched) {
            everyFormFieldIsTouched = false;
            break;
          }
        }
      }
    })(key);

    return everyFormFieldIsTouched;
  }

  private static validateFactory(
    formField: FormField,
    rule: Rule,
    ruleNumber: number
  ): Validate | undefined {
    const buffer = new LinkedList<boolean>();

    const setError = (
      formField: FormField,
      ruleNumber: number,
      error: unknown
    ) => {
      if (typeof error === 'string' && formField.touched) {
        formField.setError(ruleNumber, error);
        throw error;
      } else {
        formField.setError(ruleNumber, null);
      }
    };

    const validator: Validator = (formField, rule, ruleNumber) => async () => {
      let error: unknown;
      const ruleResult = rule(unref(formField.modelValue));

      if (typeof ruleResult?.then === 'function') {
        formField.validating.value = true;

        const node = buffer.addLast(false);

        if (node.prev) {
          node.prev.value = true;
        }

        try {
          error = await ruleResult;
        } catch (err) {
          error = err;
        }

        buffer.remove(node);

        if (!node.value) {
          formField.validating.value = false;
          setError(formField, ruleNumber, error);
        }
      } else {
        error = ruleResult;
        setError(formField, ruleNumber, error);
      }
    };

    if (isSimpleRule(rule)) {
      return validator(formField, rule, ruleNumber);
    } else if (rule.rule) {
      return validator(formField, rule.rule, ruleNumber);
    }
  }
}
