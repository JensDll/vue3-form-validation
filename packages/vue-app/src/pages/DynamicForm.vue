<template>
  <FormProvider
    title="Dynamic Form"
    class="form max-w-3xl"
    :form="form"
    :submitting="submitting"
    @submit="handleSubmit"
    @reset="resetFields()"
  >
    <label for="a" class="form-label label-a">A</label>
    <input
      id="a"
      type="text"
      v-model="form.a.$value"
      @blur="form.a.$setTouched()"
      class="form-input input-a"
      :class="{ error: form.a.$hasError }"
    />
    <MinusCircleIcon class="minus-circle hide" />
    <PlusCircleIcon class="plus-circle" @click="addX()" />
    <FormErrors :errors="form.a.$errors" class="errors-a" />
    <template v-for="(x, xi) in form.xs" :key="x.b.$uid">
      <label for="b" class="form-label label-b">B</label>
      <input
        id="b"
        type="text"
        v-model="x.b.$value"
        @blur="x.b.$setTouched()"
        class="form-input input-b"
        :class="{ error: x.b.$hasError }"
      />
      <MinusCircleIcon class="minus-circle" @click="removeX(xi)" />
      <PlusCircleIcon class="plus-circle" @click="addY(xi)" />
      <FormErrors :errors="x.b.$errors" class="errors-b" />
      <template v-for="(y, yi) in x.ys" :key="y.c.$uid">
        <label for="c" class="form-label label-c">C</label>
        <label for="D" class="form-label label-d">D</label>
        <input
          id="c"
          type="text"
          v-model="y.c.$value"
          @blur="y.c.$setTouched()"
          class="form-input input-c"
          :class="{ error: y.c.$hasError }"
        />
        <input
          id="d"
          type="text"
          v-model="y.d.$value"
          @blur="y.d.$setTouched()"
          class="form-input input-d"
          :class="{ error: y.d.$hasError }"
        />
        <MinusCircleIcon class="minus-circle" @click="removeY(xi, yi)" />
        <FormErrors :errors="y.c.$errors" class="errors-c" />
        <FormErrors :errors="y.d.$errors" class="errors-d" />
      </template>
    </template>
    <FormButtons
      :submitting="submitting"
      @reset="resetFields()"
      class="col-span-full mt-12"
    />
  </FormProvider>
  <div>
    <label class="form-label"></label>
  </div>
</template>

<script setup lang="ts">
import FormProvider from '~/components/layout/FormProvider.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/vue/outline'
import { Field, useValidation } from 'vue3-form-validation'
import { rules } from '~/domain'
import FormButtons from './components/FormButtons.vue'

type FormData = {
  a: Field<string>
  xs: {
    b: Field<string>
    ys: {
      c: Field<string>
      d: Field<string>
    }[]
  }[]
}

const { form, submitting, validateFields, resetFields, add, remove } =
  useValidation<FormData>({
    a: {
      $value: '',
      $rules: [rules.required('Please enter some text'), rules.random()]
    },
    xs: []
  })

async function handleSubmit() {
  console.log('SUBMIT')
  try {
    const formData = await validateFields()
    console.log(formData)
  } catch (e) {
    console.log(e)
  }
}

function addX() {
  add(['xs'], {
    b: {
      $value: '',
      $rules: [rules.required('Please enter some text'), rules.random()]
    },
    ys: []
  })
}

function removeX(xi: number) {
  remove(['xs', xi])
}

let i = 0
function addY(xi: number) {
  add(['xs', xi, 'ys'], {
    c: {
      $value: '',
      $rules: [
        rules.required('Please enter some text'),
        rules.random(),
        {
          key: `key${++i}`,
          rule: rules.equal('Please enter matching values for C and D')
        }
      ]
    },
    d: {
      $value: '',
      $rules: [
        rules.required('Please enter some text'),
        rules.random(),
        {
          key: `key${i}`,
          rule: rules.equal('Please enter matching values for C and D')
        }
      ]
    }
  })
}

function removeY(xi: number, yi: number) {
  remove(['xs', xi, 'ys', yi])
}
</script>

<style lang="postcss" scoped>
:deep(.form) {
  display: grid;
  column-gap: 2rem;
  grid-template-columns:
    [left] 1fr [middle] 1fr [right minus-start]
    auto [minus-end plus-start] auto [plus-end];
}

.label-a,
.input-a,
.errors-a,
.label-b,
.input-b,
.errors-b {
  grid-column: left / right;
}

.label-c,
.input-c,
.errors-c {
  grid-column: left / middle;
}

.label-d,
.input-d,
.errors-d {
  grid-column: middle / right;
}

.label-b,
.label-c,
.label-d {
  @apply mt-4;
}

.errors-a,
.errors-b,
.errors-c,
.errors-d {
  @apply mt-2;
}

.minus-circle {
  grid-column: minus-start / minus-end;
  margin-right: -1rem;
  margin-left: 2rem;
  place-self: center end;
}

.plus-circle {
  grid-column: plus-start / plus-end;
  place-self: center end;
}

.buttons {
  grid-column: 1 / -1;
}
</style>
