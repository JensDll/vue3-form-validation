# Form validation for Vue 3
Easy to use opinionated Form validation for Vue 3.

* :milky_way: **Written in TypeScript**
* :ocean: **Dynamic Form support**
* :fallen_leaf: **Light weight**

```bash
npm i vue3-form-validation
```

Validation is async and is utilising `Promise.allSettled`, [which](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) has not yet reached cross-browser stability. Example usage can be found in this [Code Sandbox](https://codesandbox.io/s/vue-3-form-validation-demo-busd9?file=/src/LoginForm.vue).

## API
This package exports one function `useValidation`, plus some type definitions for when using TypeScript.

### useValidation
```ts
const { form, add, remove, onSubmit } = useValidation<T>(formData)
```

* `useValidation` takes the following parameters:

Parameters | Type | Required | Description
---|:-:|:-:|---
formData | `object` | `true` | The structure of your Form data.

The `formData` object has a structure that is similar to any other object you would write for `v-model` data binding. The only difference being that together with every value you can provide rules to display validation errors.

Let's look at an example how the structure of some `formData` object, can be converted to an object with the addition of rules:
```ts
const formData = {
  name: '',
  email: '',
  password: ''
}

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
    $rules: [pw => pw.length > 7 || 'Password has to be longer than 7 characters']
  }
}
```

The `formData` object can contain arrays and can be deeply nested. At the leaf level, the object should contain Form Fields whose type definition looks like the following:

```ts
type Field<T> = {
  $value: Ref<T> | T;
  $rules?: Rule<T>[];
};
```

To get the best IntelliSense while writing the `useValidation` function, it's recommended to define the structure of your `formData` upfront and pass it as the generic parameter `T`. If at some point the provided type does not fit the required structure, it will let you know by converting that section to be of type `never`. Please note that when writing in a normal `.js` file, the type will often result in `never` even though the structure of the input might be correct. This is definitely not ideal and can probably be changed, but type inference can be a bit tricky sometimes.
The type for the example above is pretty straightforward:

```ts
type FormData = {
  name: Field<string>;
  email: Field<string>;
  password: Field<string>;
}
```

* `useValidation` exposes the following state:

State | Type | Description
---|:-:|---
form | `object` | Transformed `formData` object with added metadata to every Form Field.

`Form` is a reactive object with identical structure as the `formData` input, but with added metadata to every Form Field.

**Typing:**

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
}
```

As you may have noticed, all of the properties are prefixed with the `$` symbol, which is to distinguish them from other properties but also to avoid naming conflicts.
Key | Value | Description
---|:-:|---
uid | `number` | Unique identifier of the Form Field. For dynamic Forms this can be used as the `key` attribute in `v-for`.
value | `T` | The `modelValue` of the Form Field which is meant to be used together with `v-model`.
errors | `string[]` | Array of validation error messages.
validating | `boolean` | `True` while atleast one rule is validating.
onBlur | `function` | Function which will mark this Form Field as touched. When a Form Field has been touched it will validate all it's rules after every input. Before it will not do any validation.

* `useValidation` exposes the following methods:

Signature | Parameters |  Description
--- | :-: | ---
`onSubmit(success, error?)` | | Function that will validate all Form Fields. It takes two parameters, a `success` callback and an optional `error` callback.
|| `success` | Will be called if there are no validation errors. Receives the `formData` as it's first argument.
|| `error?` | Will be called if there are validation errors. Receives no arguments.
`add(pathToArray, value)` || Utility function for writing dynamic Forms. It takes two parameters, a `pathToArray` of type `(string \| number)[]` and a `value`.
|| `pathToArray` | Tupel of `string` and `numbers` representing the path to an array in the `formData`. 
|| `value` | The `value` that will be pushed to the array at the given path.
`remove(pathToArray, index)` || Identical to `add` but instead of providing a `value` you provide an `index` that will be removed.

At the moment, there is no good IntelliSense support for the `add` and `remove` methods. When TypeScript 4.1 will be released and Vue supports it, this can be changed however.
## Writing Rules
Rules are functions that should return a `string` when the validation fails. They can be written purely as a function or together with a `key` property in an object.
They can also alternatively return a `Promise` when you have a rule that requires asynchronous code.

**Typing:**
```ts
type SimpleRule<T = any> = (value: T) => Promise<unknown> | unknown;
type KeyedRule<T = any> = { key: string; rule: SimpleRule<T> };
type Rule<T = any> = SimpleRule<T> | KeyedRule<T>;
```

Keyed rules that share the same `key` will be executed together, this can be useful in a situation where rules are dependent on another. For example the `Password` and `Repeat password` fields in a Login Form.
Rules will always be called with the latest `modelValue`, to determine if a call should result in an error, it will check if the rule's return value is of type `string`.

`main/Form.ts`
```ts
// Somewhere at the bottom of the file

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
const required = value => !value && 'This field is required';
const min = value => value.length > 3 || 'This field has to be longer than 3 characters';
const max = value => value.length < 7 || 'This field is too long (maximum is 6 characters)';
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
  })
```

## Contributing
[Contributing](https://github.com/JensD98/vue3-form-validation/blob/master/.github/contributing.md)

## License
[MIT](https://github.com/JensD98/vue3-form-validation/blob/master/LICENSE)
