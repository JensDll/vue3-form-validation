# (WIP) Form validation for Vue 3
Easy to use opinionated Form validation for Vue 3

* :milky_way: **Written in TypeScript**
* :fallen_leaf: **Light weight**
* :ocean: **Dynamic Form support**

```bash
npm i vue3-form-validation
```

Validation is async and is utilising `Promise.allSettled`, [which](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) has not yet reached cross-browser stability.
Example usage can be found in this [Code Sandbox](https://codesandbox.io/s/vue-3-form-validation-demo-busd9).

## API
This package exports one function `useValidation`, plus some type definitions for when using TypeScript.

### useValidation
```ts
const { form, add, remove, onSubmit } = useValidation<T>(formData)
```

* `useValidation` takes the following parameters:

Parameters | Type | Required | Description
---|:-:|:-:|---
formData | `object` | `true` | The structure of your form data

The `formData` object has a structure that is similar to any other object you would write for `v-model` data binding. The only difference being that for every value you can provide rules to display validation errors.

Let's look at an example how the structure of some `formData` object, can be converted to an object with the addition of rules:
```ts
const formData = {
  name: '',
  email: '',
  password: ''
}

const formDataWithRules = {
  name: {
    value: '',
    rules: [name => !name && 'Name is required']
  },
  email: {
    value: '',
    rules: [email => !email && 'E-Mail is required']
  },
  password: {
    value: '',
    rules: [pw => pw.length > 7 || 'Password has to be longer than 7 characters']
  }
}
```

The `formData` object can either be flat or nested by using arrays. The type definition for some form field looks like the following:

```ts
type Field<T> = {
  value: Ref<T> | T;
  rules?: Rule<T>[];
};
```

To get the best IntelliSense while writing the `useValidation` function, it's recommended to define the structure of your `formData` upfront and pass it as the generic paramter. If at some point the provided type does not fit the required structure, it will let you know by converting the problematic part to be of type `never`. The type for the example above is pretty straightforward:

```ts
interface FormData {
  name: Field<string>;
  email: Field<string>;
  password: Field<string>;
}
```

* `useValidation` exposes the following state:

State | Type | Description
---|:-:|---
form | `object` | Transformed `formData` object, with added metadata for every form field.

`Form` is a reactive object with identical structure of the `formData` input, but with added metadata to every form field. Typing:

```ts
type TransformedField<T> = {
  uid: number;
  value: T;
  errors: string[];
  validating: boolean;
  onBlur(): void;
};

// The type of form in the example above would be
const form: {
  name: TransformedField<string>;
  email: TransformedField<string>;
  password: TransformedField<string>;
}
```
Key | Value | Description
---|:-:|---
uid | `number` | Unique identifier of the form field. For dynamic Forms this can be used as the `key` attribute in `v-for`.
value | `T` | The value of the form field which is meant to be used together with `v-model`.
errors | `string[]` | Array of validation error messages.
validating | `boolean` | `True` while atleast one rule is validating.
onBlur | `function` | Function that will mark this form field as touched. After a form field has been touched it will validate all rules after every input. Before it will not do any validation.

To be continued ...

## Writing Rules
Rules are `async` functions that should return a `string` when the validation fails. They can be written purely as a function or together with a `key` property in an object.

**Typing:**
```ts
type SimpleRule = (value: unknown) => Promise<unknown>;
type KeyedRule = { key: string; rule: SimpleRule };
type Rule = SimpleRule | KeyedRule;
```

Keyed rules that share the same key will be executed together, this can be useful in a situation where rules are dependent on another. For example the `Password` and `Repeat password` fields in a Login Form.
Rules will always be called with the latest `modelValue`, to determine if a call should result in an error, it will check if the rule's return value is of type `string`.

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
