import {
  inject,
  InjectionKey,
  onBeforeUnmount,
  provide,
  Ref,
  watch
} from 'vue';
import useUid from './useUid';
import Form from '../Form';

export type SimpleRule = (value: unknown) => Promise<unknown>;
export type KeyedRule = { key: string; rule: SimpleRule };
export type Rule = SimpleRule | KeyedRule;

export const isSimpleRule = (rule: Rule): rule is SimpleRule =>
  typeof rule === 'function';

export const isKeyedRule = (rule: Rule): rule is KeyedRule =>
  'key' in rule && 'rule' in rule;

type RegisterField = (
  uid: number,
  fieldData: { modelValue: Ref<unknown>; rules: Ref<Rule[]> }
) => { onBlur(): void; errors: Ref<string[]>; validating: Ref<boolean> };

let registerFieldKey: InjectionKey<RegisterField>;

export function useBaseForm(modelValue: Ref<unknown>, rules: Ref<Rule[]>) {
  const uid = useUid();

  const registerField = inject(registerFieldKey);

  if (!registerField) {
    throw Error(
      'This component can only be used inside of the base form component'
    );
  }

  const { onBlur, errors, validating } = registerField(uid, {
    rules,
    modelValue
  });

  return {
    uid,
    onBlur,
    errors,
    validating
  };
}

export function provideBaseForm() {
  const form = new Form();

  registerFieldKey = Symbol();

  provide(registerFieldKey, (uid, { modelValue, rules }) => {
    const formField = form.registerField(uid, rules.value);

    formField.modelValue = modelValue.value;

    watch(modelValue, async modelValue => {
      formField.modelValue = modelValue;
      if (formField.touched) {
        await form.validate(uid);
      }
    });

    onBeforeUnmount(() => {
      form.onDelete(uid);
    });

    return {
      async onBlur() {
        if (!formField.touched) {
          formField.touched = true;
          await form.validate(uid);
        }
      },
      errors: formField.getErrors(),
      validating: formField.validating()
    };
  });

  return {
    onSubmit: () => form.validateAll()
  };
}
