import { computed, reactive, unref } from 'vue';
import { SimpleRule, Rule } from './composable/useValidation';
import FormField from './FormField';
import { tryGet, trySet } from './utils';

type ValidateResult = void | string;

type Validator = (
  formField: FormField
) => (index: number, rule: SimpleRule) => () => Promise<ValidateResult>;

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

  registerField(uid: number, rules: Rule[], modelValue?: unknown) {
    const formField = new FormField(rules, modelValue);

    const simple = rules.reduce<Simple>(
      (simple, rule, index) => {
        const validate = this.makeValidate(formField, rule, index);

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

  resetFields() {
    for (const { formField } of this.simpleValidators.values()) {
      formField.reset();
    }
  }

  async validateAll() {
    for (const { formField } of this.simpleValidators.values()) {
      formField.touched = false;
    }

    const promises = [...this.simpleValidators.entries()].map(
      ([uid, { formField }]) => {
        formField.touched = true;
        return this.validate(uid);
      }
    );

    const allSettledResults = await Promise.all(promises);

    for (const settledResults of allSettledResults) {
      for (const settledResult of settledResults) {
        if (settledResult.status === 'rejected') {
          return true;
        }
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
            ...this.getValidateResultsFor(keys)
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

  private getValidateResultsFor(keys: string[]) {
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
    index: number
  ): Validate {
    const validator: Validator = formField => (index, rule) => async () => {
      let error: unknown;

      try {
        formField.incrementWaiting(index);
        error = await rule(unref(formField.modelValue));
      } catch (err) {
        error = err;
      } finally {
        formField.decrementWaiting(index);
      }

      if (formField.nooneIsWaiting(index) && formField.touched) {
        if (typeof error === 'string') {
          formField.setError(index, error);
          throw error;
        } else {
          formField.setError(index, null);
        }
      }
    };

    return validator(formField)(index, isSimpleRule(rule) ? rule : rule.rule);
  }
}
