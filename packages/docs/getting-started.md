## Installation

<script setup>
import HelloWorld from './.vitepress/components/HelloWorld.vue'
</script>

```bash
npm install vue3-form-validation
# or with yarn
yarn add vue3-form-validation
```

```ts
import { createValidation } from 'vue3-form-validation'

const validation = createValidation({
  defaultValidationBehavior: 'lazier'
})

app.use(validation)
```

<HelloWorld />
