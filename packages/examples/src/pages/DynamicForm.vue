<template>
  <FormProvider
    title="Dynamic Form"
    class="form max-w-3xl"
    :form="form"
    @submit="handleSubmit"
  >
    <label for="a" class="form-label label-a">A</label>
    <div class="relative flex items-center input-a">
      <LoadingIcon
        v-show="form.a.$validating"
        class="w-5 h-5 absolute right-4 text-indigo-600"
        :class="{ '!text-red-500': form.a.$hasError }"
        spin
      />
      <input
        id="a"
        class="form-input w-full"
        :class="{ error: form.a.$hasError }"
        type="text"
        v-model="form.a.$value"
        @blur="form.a.$setTouched()"
      />
    </div>
    <MinusCircleIcon class="minus-circle hide" />
    <PlusCircleIcon class="plus-circle" @click="addX()" />
    <FormErrors class="errors-a" :errors="form.a.$errors" />
    <template v-for="(x, xi) in form.xs" :key="x.b.$uid">
      <label for="b" class="form-label label-b">B</label>
      <div class="relative flex items-center input-a">
        <LoadingIcon
          v-show="x.b.$validating"
          class="w-5 h-5 absolute right-4 text-indigo-600"
          :class="{ '!text-red-500': x.b.$hasError }"
          spin
        />
        <input
          id="b"
          class="form-input w-full"
          :class="{ error: x.b.$hasError }"
          type="text"
          v-model="x.b.$value"
          @blur="x.b.$setTouched()"
        />
      </div>
      <MinusCircleIcon class="minus-circle" @click="removeX(xi)" />
      <PlusCircleIcon class="plus-circle" @click="addY(xi)" />
      <FormErrors class="errors-b" :errors="x.b.$errors" />
      <template v-for="(y, yi) in x.ys" :key="y.c.$uid">
        <label for="c" class="form-label label-c">C</label>
        <label for="D" class="form-label label-d">D</label>
        <div class="relative flex items-center input-c">
          <LoadingIcon
            v-show="y.c.$validating"
            class="w-5 h-5 absolute right-4 text-indigo-600"
            :class="{ '!text-red-500': y.c.$hasError }"
            spin
          />
          <input
            id="c"
            class="form-input w-full"
            :class="{ error: y.c.$hasError }"
            type="text"
            v-model="y.c.$value"
            @blur="y.c.$setTouched()"
          />
        </div>
        <div class="relative flex items-center input-d">
          <LoadingIcon
            v-show="y.d.$validating"
            class="w-5 h-5 absolute right-4 text-indigo-600"
            :class="{ '!text-red-500': y.d.$hasError }"
            spin
          />
          <input
            id="d"
            class="form-input w-full"
            :class="{ error: y.d.$hasError }"
            type="text"
            v-model="y.d.$value"
            @blur="y.d.$setTouched()"
          />
        </div>
        <MinusCircleIcon class="minus-circle" @click="removeY(xi, yi)" />
        <FormErrors class="errors-c" :errors="y.c.$errors" />
        <FormErrors class="errors-d" :errors="y.d.$errors" />
      </template>
    </template>
    <div class="col-span-full mt-12">
      <label class="form-label mb-0 capitalize" for="box-a">
        Validate Fields
      </label>
      <div class="flex">
        <div
          v-for="name in ['a', 'b', 'c', 'd']"
          :key="name"
          class="ml-4 first:ml-0"
        >
          <label
            :for="`box-${name}`"
            class="form-label font-normal mb-0 capitalize"
          >
            {{ name }}
          </label>
          <input
            type="checkbox"
            :id="`box-${name}`"
            class="form-input"
            v-model="fieldNames"
            :value="name"
          />
        </div>
      </div>
    </div>
    <FormButtons
      class="col-span-full mt-6"
      :submitting="submitting"
      @reset="resetFields()"
    />
  </FormProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/vue/outline'
import { Field, FieldNames, useValidation } from 'vue3-form-validation'

import FormProvider from '~/components/form/FormProvider.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import LoadingIcon from '~/components/icon/LoadingIcon.vue'
import FormButtons from '~/components/form/FormButtons.vue'
import { rules } from '~/domain'

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

const { form, submitting, validateFields, resetFields, add, remove } =
  useValidation<FormData>({
    a: {
      $value: '',
      $rules: [rules.required('Please enter some text'), rules.random()]
    },
    xs: []
  })

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

function addY(xi: number) {
  add(['xs', xi, 'ys'], {
    c: {
      $value: '',
      $rules: [rules.required('Please enter some text'), rules.random()]
    },
    d: {
      $value: '',
      $rules: [rules.required('Please enter some text'), rules.random()]
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
</style>
