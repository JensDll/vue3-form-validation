import { computed, reactive, ref, unref } from 'vue';
import { SimpleRule, Rule } from './composition/useValidation';
import FormField from './FormField';
import { PromiseCancel, tryGet, trySet } from './utils';

type ValidateResult = void | string;

type Validator = (
  formField: FormField
) => (
  rule: SimpleRule,
  ruleNumber: number,
  promiseCancel: PromiseCancel
) => () => Promise<ValidateResult>;

type Validate = ReturnType<ReturnType<Validator>>;

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

export default class Form {
  private simpleValidators: Map<number, Simple> = new Map();
  private keyedValidators: Map<string, Keyed> = new Map();

  private reactiveFormFields: Map<number, FormField> = reactive(new Map());

  private trySetKeyed = trySet(this.keyedValidators);
  private tryGetSimple = tryGet(this.simpleValidators);
  private tryGetKeyed = tryGet(this.keyedValidators);

  submitting = ref(false);

  registerField(uid: number, rules: Rule[], modelValue?: unknown) {
    const formField = new FormField(rules, modelValue);

    const simple = rules.reduce<Simple>(
      (simple, rule, ruleNumber) => {
        const validate = this.makeValidate(formField, rule, ruleNumber);

        if (isSimpleRule(rule)) {
          simple.validators.push(validate);
        } else {
          const entry = { formField, validator: validate };

          simple.keys.push(rule.key);

          this.trySetKeyed({
            failure: keyed => keyed.add(entry)
          })(rule.key, new Set([entry]));

          simple.rollback.push(() => {
            this.tryGetKeyed({
              success: keyed => {
                keyed.delete(entry);

                if (!keyed.size) {
                  this.keyedValidators.delete(rule.key);
                }
              }
            })(rule.key);
          });
        }

        return simple;
      },
      {
        formField,
        keys: [],
        validators: [],
        rollback: []
      }
    );

    this.simpleValidators.set(uid, simple);
    this.reactiveFormFields.set(uid, formField);

    return formField;
  }

  getErrors() {
    return computed(() => {
      const errors: string[] = [];

      for (const formField of this.reactiveFormFields.values()) {
        errors.push(...formField.getErrors().value);
      }

      return errors;
    });
  }

  resetFields(toDefaultValues = true) {
    for (const { formField } of this.simpleValidators.values()) {
      formField.reset(toDefaultValues);
    }
  }

  async validateAll() {
    const promises = [];

    for (const { formField, validators } of this.simpleValidators.values()) {
      formField.touched = true;
      promises.push(...validators.map(v => v()));
    }

    for (const keyed of this.keyedValidators.values()) {
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
    let promise: Promise<
      PromiseSettledResult<ValidateResult>[]
    > = Promise.allSettled([] as void[]);

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

    this.simpleValidators.delete(uid);
    this.reactiveFormFields.delete(uid);
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

  private makeValidate(
    formField: FormField,
    rule: Rule,
    ruleNumber: number
  ): Validate {
    const validator: Validator = formField => (
      rule,
      ruleNumber: number,
      promiseCancel
    ) => async () => {
      let error: unknown;

      const ruleResult = rule(unref(formField.modelValue));

      if (typeof ruleResult?.then === 'function') {
        try {
          formField.rulesValidating.value++;

          if (!this.submitting.value) {
            promiseCancel.cancelResolve(null);
          }

          error = await promiseCancel.race(ruleResult);
        } catch (err) {
          error = err;
        } finally {
          formField.rulesValidating.value--;
        }
      } else {
        error = ruleResult;
      }

      if (typeof error === 'string' && formField.touched) {
        formField.setError(ruleNumber, error);
        throw error;
      } else {
        formField.setError(ruleNumber, null);
      }
    };

    return validator(formField)(
      isSimpleRule(rule) ? rule : rule.rule,
      ruleNumber,
      new PromiseCancel()
    );
  }
}
