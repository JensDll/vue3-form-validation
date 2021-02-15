# Form Validation for Vue 3

[![npm](https://img.shields.io/npm/v/vue3-form-validation)](https://www.npmjs.com/package/vue3-form-validation)

Opinionated Vue composition function for Form Validation.

- :milky_way: **Written in TypeScript**
- :ocean: **Dynamic Form support**
- :fallen_leaf: **Light weight**

```bash
npm install vue3-form-validation
```

Validation is async and is utilising `Promise.allSettled`, [which](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) has not yet reached cross-browser stability. Example usage can be found in this [Code Sandbox](https://codesandbox.io/s/vue-3-form-validation-demo-busd9?file=/src/LoginForm.vue).

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
  - **Required** - `true`
  - **Description** - The structure of your `formData`.

The `formData` object has a structure that is similar to any other object you would write for `v-model` data binding. The only difference being that together with every value you can provide rules to display validation errors.

Let's look at an example how the structure of some `formData` object can be converted to an object with the addition of rules:

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

The `formData` object can contain arrays and can be deeply nested. At the leaf level, the object should contain Form Fields whose simplified type definition looks like the following:

```ts
type Field<T> = {
  $value: Ref<T> | T;
  $rules?: Rule<T>[];
};
```

To get better type inference while writing the `useValidation` function, it's recommended to define the structure of your `formData` upfront and pass it as the generic parameter `T`. The type for the example above is pretty straightforward:

```ts
type FormData = {
  name: Field<string>;
  email: Field<string>;
  password: Field<string>;
};
```

### `useValidation` exposes the following state:

- `form`
  - **Type** - `object`
  - **Description** - Transformed `formData` object.
- `submitting`
  - **Type** - `Ref<boolean>`
  - **Description** - `True` during validation after calling `validateFields`.
- `errors`
  - **Type** - `ComputedRef<string[]>`
  - **Description** - Array of all current validation errors messages.

`Form` is a reactive object with identical structure as the `formData` input, but with added metadata to every Form Field:

```ts
type TransformedField<T> = {
  $uid: number;
  $value: T;
  $errors: string[];
  $validating: boolean;
  $onBlur(): void;
};

// The type of form in the example above would therefore be
const form: {
  name: TransformedField<string>;
  email: TransformedField<string>;
  password: TransformedField<string>;
};
```

As you may have noticed, all of the properties are prefixed with the `$` symbol, which is to distinguish them from other properties but also to avoid naming conflicts:

- `$uid`
  - **Type** - `number`
  - **Description** - Unique identifier of the Form Field. For dynamic Forms this can be used as the `key` attribute in `v-for`.
- `$value`
  - **Type** - `T`
  - **Description** - The `modelValue` of the Form Field which is meant to be used together with `v-model`.
- `$errors`
  - **Type** - `string[]`
  - **Description** - Array of validation error messages.
- `$validating`
  - **Type** - `boolean`
  - **Description** - `True` while at least one rule is validating.
- `$onBlur`
  - **Type** - `function`
  - **Description** - Function which will mark this Form Field as touched. When a Form Field has been touched it will validate all it's rules after every input. Before it will not do any validation.

### `useValidation` exposes the following methods:

- `validateFields() -> Promise`
  - **Description** - Validate all Form Fields.
  - **Returns** - A `Promise` which will reject if there are validation errors, and resolve with the `formData` otherwise.
- `resetFields() -> void`
  - **Description** - Reset all Form Fields to their original values.
- `add(pathToArray: (string | number)[], value: any) -> void`
  - **Description** - Utility function for writing dynamic Forms.
  - **Parameters**
    - `pathToArray` - Tuple representing the path to an array in the `formData`.
    - `value` - The value that will be pushed to the array at the given path.
- `remove(pathToArray: (string | number)[], index: number) -> void`
  - **Description** - Utility function for writing dynamic Forms.
  - **Parameters**
    - `pathToArray` - Tuple representing the path to an array in the `formData`.
    - `index` - Array index that will be remove.

## Writing Rules

Rules are functions that should return a `string` when the validation fails. They can be written purely as a function or together with a `key` property in an object.
They can also alternatively return a `Promise` when you have a rule that requires asynchronous code.

**Typing:**

```ts
type SimpleRule<T = any> = (value: T) => Promise<unknown> | unknown;
type KeyedRule<T = any> = { key: string; rule: SimpleRule<T> };
type Rule<T = any> = SimpleRule<T> | KeyedRule<T>;
```

Keyed rules that share the same `key` will be executed together, this can be useful in a situation where rules are dependent on another. For example the `Password` and `Repeat Password` fields in a Login Form.
Rules will always be called with the latest `modelValue`, to determine if a call should result in an error, it will check if the rule's return value is of type `string`.
This allows you to write many rules in one line:

```ts
const required = value => !value && 'This field is required';
const min = value =>
  value.length > 3 || 'This field has to be longer than 3 characters';
const max = value =>
  value.length < 7 || 'This field is too long (maximum is 6 characters)';
```

Async rules allow you to perform network requests, for example checking if a username already exists in the database:

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

## Contributing

[Contributing](https://github.com/JensD98/vue3-form-validation/blob/master/.github/contributing.md)

## License

[MIT](https://github.com/JensD98/vue3-form-validation/blob/master/LICENSE)
