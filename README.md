# Form Validation for Vue 3

[![npm](https://img.shields.io/npm/v/vue3-form-validation)](https://www.npmjs.com/package/vue3-form-validation)

Vue composition function for Form Validation.

- :milky_way: **Written in TypeScript**
- :ocean: **Dynamic Form support**
- :fallen_leaf: **Light weight**

```bash
npm install vue3-form-validation
```

Validation is async and is utilising `Promise.allSettled`, [which](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) has not yet reached cross-browser stability. Example usage can be found in this [Code Sandbox](https://codesandbox.io/s/vue-3-form-validation-demo-7mp4z?file=/src/views/SignupForm.vue).

## API

This package exports one function `useValidation`, plus some type definitions for when using TypeScript.

```ts
const {
  form,
  errors,
  submitting,
  validateFields,
  resetFields,
  add,
  remove
} = useValidation<T>(formData);
```

### `useValidation` takes the following parameters:

- `formData`
  - **Type** - `object`
  - **Description** - The structure of your form data.

The form data object has a structure that is similar to any other object you would write for `v-model` data binding. The only difference being that together with every value you can provide rules to display validation errors.

Let's look at an example how the structure of some form data object can be converted to an object with the addition of rules:

```ts
const formData = {
  name: '',
  email: '',
  password: ''
};

// The above can be converted to the following
const formDataWithRules = {
  name: {
    $value: '',
    $rules: [name => !name && 'Name is required']
  },
  email: {
    $value: '',
    $rules: [email => !email && 'E-Mail is required']
  },
  password: {
    $value: '',
    $rules: [
      pw => pw.length > 7 || 'Password has to be longer than 7 characters'
    ]
  }
};
```

The form data object can contain arrays and can be deeply nested. At the leaf level, the object should contain fields whose simplified type definition looks like the following:

```ts
type Field<T> = {
  $value: Ref<T> | T;
  $rules?: Rule<T>[];
};
```

To get better type inference while writing the `useValidation` function, it's recommended to define the structure of your data upfront and pass it as the generic parameter `T`. The type for the example above is pretty straightforward:

```ts
type FormData = {
  name: Field<string>;
  email: Field<string>;
  password: Field<string>;
};

const { ... } = useValidation<FormData>({ ... });
```

### `useValidation` exposes the following state:

- `form`
  - **Type** - `object`
  - **Description** - Transformed form data object.
- `submitting`
  - **Type** - `Ref<boolean>`
  - **Description** - `True` during validation after calling `validateFields`.
- `errors`
  - **Type** - `ComputedRef<string[]>`
  - **Description** - Array of all current validation error messages.

`Form` is a reactive object with identical structure as the form data input.
Every object with a `$value` property will be converted to an object of the following form:

```ts
type TransformedField<T> = {
  $uid: number;
  $value: T;
  $errors: string[];
  $validating: boolean;
  $onBlur(): void;
};
```

Given the structure of the previous example, this will result in the following type:

```ts
type Form = {
  name: TransformedField<string>;
  email: TransformedField<string>;
  password: TransformedField<string>;
};
```

As you may have noticed, all of the properties are prefixed with the `$` symbol, which is to distinguish them from other properties but also to avoid naming conflicts. Below is a
description of all the properties and their use case:

- `$uid`
  - **Type** - `number`
  - **Description** - Unique identifier of the field. For dynamic forms this can be used as the `key` attribute in `v-for`.
- `$value`
  - **Type** - `T`
  - **Description** - The `modelValue` of the field, which is meant to be used together with `v-model`.
- `$errors`
  - **Type** - `string[]`
  - **Description** - Array of validation error messages.
- `$validating`
  - **Type** - `boolean`
  - **Description** - `True` while at least one rule is validating.
- `$onBlur`
  - **Type** - `function`
  - **Description** - Function which will mark this field as touched. When a field has been touched, it will validate all it's rules after every input. Before it will not do any validation.

### `useValidation` exposes the following methods:

- `validateFields() -> Promise`
  - **Description** - Validate all fields.
  - **Returns** - A `Promise` which will reject if there are validation errors, and resolve with the form data otherwise.
- `resetFields(formData?: object) -> void`
  - **Description** - Reset all fields to their original value, or pass an object to set specific values.
  - **Parameters**
    - `formData?` - Values to use when resetting ([Sandbox](https://codesandbox.io/s/vue-3-form-validation-demo-7mp4z?file=/src/views/SignupForm.vue)).
- `add(pathToArray: (string | number)[], value: any) -> void`
  - **Description** - Utility function for writing dynamic forms.
  - **Parameters**
    - `pathToArray` - Tuple representing the path to an array in the form data.
    - `value` - The value that will be pushed to the array at the given path.
- `remove(pathToArray: (string | number)[], index: number) -> void`
  - **Description** - Utility function for writing dynamic forms.
  - **Parameters**
    - `pathToArray` - Tuple representing the path to an array in the form data.
    - `index` - Array index which will be remove.

## Writing Rules

Rules are functions that should return a `string` when the validation fails. They can be written purely as a function or together with a `key` property in an object.
They can also alternatively return a `Promise` when you have a rule that requires asynchronous code.

**Typing:**

```ts
type SimpleRule<T = any> = (value: T) => Promise<unknown> | unknown;
type KeyedRule<T = any> = { key: string; rule: SimpleRule<T> };
type Rule<T = any> = SimpleRule<T> | KeyedRule<T>;
```

Keyed rules that share the same `key` will be executed together. This can be useful in a situation where rules are dependent on another, such as the `Password` and `Repeat Password` fields in a [Signup Form](https://codesandbox.io/s/vue-3-form-validation-demo-7mp4z?file=/src/views/SignupForm.vue).
Rules will always be called with the latest `modelValue`, to determine if a call should result in an error, it will check if the rule's return value is of type `string`.

> To prevent overly aggressive error messages, keyed rules will only be called
> after all Fields with connected rules have been touched.

Because of the way the [logical operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#logical_operators) work in JavaScript, many basic rules can be written in one line:

```ts
const required = value => !value && 'This field is required';
const min = value =>
  value.length > 3 || 'This field has to be longer than 3 characters';
const max = value =>
  value.length < 7 || 'This field is too long (maximum is 6 characters)';
```

Async rules allow you to perform network requests, for instance checking if a username exists in the database. Same criteria apply as for simple rules, `resolve` or `reject` with a string if the validation fails:

```ts
const isNameTaken = name =>
  new Promise(resolve => {
    setTimeout(() => {
      if (['foo', 'bar'].includes(name)) {
        resolve();
      } else {
        resolve('This name is already taken');
      }
    }, 2000);
  });
```

## Troubleshooting

- If you encounter errors while building, you may have to install a TypeScript **version >= 4.1**

## Contributing

If you find problems or if you have use cases that you think are not easy to achieve with the current API, please let me know :+1:
Feel free to write an issue or open a pull request, for more information about the project check out the
[contributing guideline](https://github.com/JensD98/vue3-form-validation/blob/master/.github/contributing.md).

## License

[MIT](https://github.com/JensD98/vue3-form-validation/blob/master/LICENSE)
