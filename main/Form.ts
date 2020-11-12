import { SimpleRule, Rule, isSimpleRule } from './composable/useValidation';
import FormField from './FormField';
import { tryGet, trySet } from './utils';

type Validator = (
  formField: FormField
) => (index: number, rule: SimpleRule) => () => Promise<void | string>;

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

export default class Form {
  private simpleValidators: Map<number, Simple> = new Map();
  private keyedValidators: Map<string, Keyed> = new Map();

  registerField(uid: number, rules: Rule[]) {
    const formField = new FormField(rules);

    const simple = rules.reduce<Simple>(
      (acc, rule, index) => {
        const validate = this.makeValidate(formField, rule, index);

        if (isSimpleRule(rule)) {
          acc.validators.push(validate);
        } else {
          const entry = { formField, validator: validate };

          acc.keys.push(rule.key);

          trySet(this.keyedValidators)({
            failure: validators => {
              validators.add(entry);
            }
          })(rule.key, new Set([entry]));

          acc.rollback.push(() => {
            tryGet(this.keyedValidators)({
              success: validators => {
                validators.delete(entry);

                if (!validators.size) {
                  this.keyedValidators.delete(rule.key);
                }
              }
            })(rule.key);
          });
        }

        return acc;
      },
      {
        formField,
        keys: [],
        validators: [],
        rollback: []
      }
    );

    this.simpleValidators.set(uid, simple);

    return formField;
  }

  async validateAll() {
    const promises = [...this.simpleValidators.entries()].map(
      ([uid, { formField }]) => {
        formField.touched = true;
        return this.validate(uid);
      }
    );

    const errors = await Promise.all(promises);

    for (const promiseResults of errors) {
      for (const result of promiseResults) {
        if (result.status === 'rejected') {
          return true;
        }
      }
    }

    return false;
  }

  validate(uid: number) {
    let promise: Promise<
      PromiseSettledResult<string | void>[]
    > = Promise.allSettled([] as void[]);

    tryGet(this.simpleValidators)({
      success: ({ formField, keys, validators }) => {
        if (formField.touched) {
          promise = Promise.allSettled([
            ...validators.map(v => v()),
            ...this.getValidatorsFor(keys).map(v => v())
          ]);
        }
      }
    })(uid);

    return promise;
  }

  onDelete(uid: number) {
    tryGet(this.simpleValidators)({
      success({ rollback }) {
        rollback.forEach(r => r());
      }
    })(uid);

    this.simpleValidators.delete(uid);

    console.log(this.simpleValidators);

    console.log(this.keyedValidators);
  }

  private getValidatorsFor(keys: string[]) {
    return keys.reduce((promises, key) => {
      tryGet(this.keyedValidators)({
        success(validators) {
          let everyFormFieldIsTouched = true;

          validators.forEach(({ formField }) => {
            if (!formField.touched) {
              everyFormFieldIsTouched = false;
            }
          });

          if (everyFormFieldIsTouched) {
            promises.push(
              ...[...validators.values()].map(({ validator }) => validator)
            );
          }
        }
      })(key);

      return promises;
    }, [] as Validate[]);
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
        error = await rule(formField.modelValue);
      } catch (err) {
        error = err;
      } finally {
        formField.decrementWaiting(index);
      }

      if (formField.nooneIsWaiting(index)) {
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
