<script setup lang="ts">
import { ref } from 'vue'
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/vue/outline'
import { Field, FieldNames, useValidation } from 'vue3-form-validation'

import FormInput from '~/components/form/FormInput.vue'
import FormProvider from '~/components/form/FormProvider.vue'
import FormButtons from '~/components/form/FormButtons.vue'
import { rules } from '~/utils'

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

const fieldNames = ref<FieldNames<FormData>[]>(['a', 'b', 'c', 'd'])

const {
  form,
  hasError,
  errors,
  validating,
  submitting,
  validateFields,
  resetFields,
  add,
  remove
} = useValidation<FormData>({
  a: {
    $value: '',
    $rules: [rules.random()]
  },
  xs: []
})

function addX() {
  add(['xs'], {
    b: {
      $value: '',
      $rules: [rules.random()]
    },
    ys: []
  })
}

function removeX(xi: number) {
  remove(['xs', xi])
}

function addY(xi: number) {
  add(['xs', xi, 'ys'], {
    c: {
      $value: '',
      $rules: [rules.random()]
    },
    d: {
      $value: '',
      $rules: [rules.random()]
    }
  })
}

function removeY(xi: number, yi: number) {
  remove(['xs', xi, 'ys', yi])
}

async function handleSubmit() {
  try {
    const formData = await validateFields({
      names: fieldNames.value
    })
    console.log(formData)
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <FormProvider
    title="Dynamic Form"
    class="form max-w-3xl"
    :validating="validating"
    :submitting="submitting"
    :has-error="hasError"
    :errors="errors"
    :form="form"
    @submit="handleSubmit"
  >
    <div class="field-container">
      <FormInput
        :label="{ value: 'A', for: 'a' }"
        :errors="form.a.$errors"
        :validating="form.a.$validating"
        :classes="{
          label: 'label-a',
          input: 'input-a',
          error: 'error-a'
        }"
        v-model="form.a.$value"
        @blur="form.a.$validate()"
      />
      <PlusCircleIcon class="plus-circle" @click="addX()" />
    </div>

    <template v-for="(x, xi) in form.xs" :key="x.b.$uid">
      <div class="field-container">
        <FormInput
          :label="{ value: 'B', for: 'b' }"
          :errors="x.b.$errors"
          :validating="x.b.$validating"
          :classes="{
            label: 'label-b',
            input: 'input-b',
            error: 'error-b'
          }"
          v-model="x.b.$value"
          @blur="x.b.$validate()"
        >
        </FormInput>
        <MinusCircleIcon class="minus-circle" @click="removeX(xi)" />
        <PlusCircleIcon class="plus-circle" @click="addY(xi)" />
      </div>

      <div v-for="(y, yi) in x.ys" :key="y.c.$uid" class="field-container">
        <MinusCircleIcon class="minus-circle" @click="removeY(xi, yi)" />
        <FormInput
          :label="{ value: 'C', for: 'c' }"
          :errors="y.c.$errors"
          :validating="y.c.$validating"
          :classes="{
            label: 'label-c',
            input: 'input-c',
            error: 'error-c'
          }"
          v-model="y.c.$value"
          @blur="y.c.$validate()"
        />
        <FormInput
          :label="{ value: 'D', for: 'd' }"
          :errors="y.d.$errors"
          :validating="y.d.$validating"
          :classes="{
            label: 'label-d',
            input: 'input-d',
            error: 'error-d'
          }"
          v-model="y.d.$value"
          @blur="y.d.$validate()"
        />
      </div>
    </template>

    <div class="col-span-full mt-6">
      <label class="form-label mb-0 capitalize" for="box-a">
        Validate Fields
      </label>
      <div class="flex">
        <div
          v-for="name in ['a', 'b', 'c', 'd']"
          :key="name"
          class="ml-4 first:ml-0"
        >
          <FormInput
            type="checkbox"
            :label="{
              for: `box-${name}`,
              value: name
            }"
            :classes="{
              label: 'font-normal mb-0 capitalize'
            }"
            v-model="fieldNames"
            :value="name"
          />
        </div>
      </div>
    </div>

    <FormButtons
      class="col-span-full"
      :submitting="submitting"
      @reset="resetFields()"
    />
  </FormProvider>
</template>

<style lang="postcss" scoped>
:deep(.form) {
  display: grid;
  row-gap: 1.5rem;
}

.field-container {
  display: grid;
  column-gap: 2rem;
  grid-template-columns: 1fr 1fr 1rem 2rem;
  grid-template-rows: repeat(3, auto);
  grid-template-areas:
    'label-1 label-2 . .'
    'input-1 input-2 minus-icon plus-icon'
    'error-1 error-2 . .';
}

.minus-circle {
  align-self: center;
  justify-self: end;
  margin-right: -1rem;
  grid-area: minus-icon;
}

.plus-circle {
  align-self: center;
  justify-self: end;
  grid-area: plus-icon;
}

:deep(.label-a),
:deep(.label-b) {
  grid-area: label-1 / label-1 / label-2 / label-2;
}

:deep(.input-a),
:deep(.input-b) {
  grid-area: input-1 / input-1 / input-2 / input-2;
}

:deep(.error-a),
:deep(.error-b) {
  grid-area: error-1 / error-1 / error-2 / error-2;
}

:deep(.label-c) {
  grid-area: label-1;
}

:deep(.label-d) {
  grid-area: label-2;
}

:deep(.input-c) {
  grid-area: input-1;
}

:deep(.input-d) {
  grid-area: input-2;
}

:deep(.error-c) {
  grid-area: error-1;
}

:deep(.error-d) {
  grid-area: error-2;
}
</style>
