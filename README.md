# (WIP) Form validation for Vue 3
Easy to use Form Validation for Vue 3

* :milky_way: **Written in TypeScript**
* :fallen_leaf: **Light weight**

Note this is still WIP! But a working prototype is currently available and can be used.

```bash
npm i vue3-form-validation
```

Validation is async and is utilising `Promise.allSettled`, [which](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) has not yet reached cross-browser stability.
Example usage can be found in this [Code Sandbox](https://codesandbox.io/s/vue-3-form-validation-demo-busd9).

## API
Currently this package exports two functions `provideBaseForm` and `useBaseForm`, plus some type definitions when using TypeScript (see `vue3-form-validation/composable/useForm.ts` for all exports).

Both functions are meant to be used inside of base form components. They make use of `provide` and `inject` to communicate data, which means that `provideBaseForm` has to be called in a component that is higher up in the tree than `useBaseForm`.

`SomeForm.vue`
``` html
<template>
  <BaseForm>        <-- provideBaseForm()
    <BaseInput />   <-- useBaseForm()
    <BaseSelect />  <-- useBaseForm()
  </BaseForm>
</template>
```

### provideBaseForm
``` ts
const { onSubmit } = provideBaseForm();
```

* `provideBaseForm` exposes the following methods:

Signature | Returns | Description
:-:|:-:|---
`onSubmit()` | `Promise<boolean>` | Call this when submitting the form. It validates all fields and returns a boolean value that indicates whether or not there are errors.

### useBaseForm
``` ts
const { uid, onBlur, errors, validating } = useBaseForm(modelValue, rules);
```

* `useBaseForm` takes the following parameters:

Parameters | Type | Required | Description
---|:-:|:-:|---
modelValue | `Ref<unknown>` | `true` | A `ref` that holds the current form field value.
rules | `Ref<(function \| object)[]>` | `true` | A `ref` with an array of rules.

* `useBaseForm` exposes the following state:

State | Type | Description
---|:-:|---
uid | `number` | Unique id of the form field.
errors | `Ref<string[]>` | Validation errors.
validating | `Ref<boolean>` | `True` while atleast one rule is validating.

* `useBaseForm` exposes the following methods:

Signature | Returns | Description
:-:|:-:|---
`onBlur()` | `void` | Call this when the form field `blur` event fires.

## Writing Rules
Rules are `async` functions that should return a `string` when the validation fails. They can be written purely as a function or togehther with a `key` property in an object.

**Typing:**
```ts
type SimpleRule = (value: unknown) => Promise<unknown>;
type KeyedRule = { key: string; rule: SimpleRule };
type Rule = SimpleRule | KeyedRule;
```

For now rules are meant to be passed as `props` to your base form components, where you then use them as a parameter for `useBaseForm`. KeyedRules that share the same key will be executed together, this can be useful in a situation where rules are dependent on another. For example the `Password` and `Repeat password` fields in a Login Form.
Rules will always be called with the latest `modelValue`, to determine if a call should result in an error, it will check if the rule return value is of type `string`.

`vue3-form-validation/Form.ts`
```ts
let error: unknown;
// ...
error = await rule(formField.modelValue);
// ...
if (typeof error === 'string') {
  // report validation error
}
// ...
```

This allows you to write many rules in one line:
```ts
const required = async value => !value && "This field is required";
const min = async value => value.length > 3 || "This field has to be longer than 3 characters";
const max = async value => value.length < 7 || "This field is too long (maximum is 6 characters)";
```
Of course you can also return a `Promise` directly or perform network requests, for example checking if a username already exists in the database.
