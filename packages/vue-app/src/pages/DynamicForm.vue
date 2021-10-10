<template>
  <FormProvider
    title="Dynamic Form"
    class="grid gap-y-6 max-w-3xl"
    :form="form"
    @submit="handleSubmit"
    @reset="resetFields()"
  >
    <div>
      <label for="a" class="form-label">A</label>
      <div class="flex items-center">
        <input
          id="a"
          type="text"
          v-model="form.a.$value"
          @blur="form.a.$setTouched()"
          class="form-input w-full mr-16"
          :class="{ error: form.a.$hasError }"
        />
        <div class="flex">
          <MinusCircleIcon class="minus-circle mr-4 hide" />
          <PlusCircleIcon class="plus-circle" @click="addX()" />
        </div>
      </div>
      <FormErrors :errors="form.a.$errors" class="mt-2" />
    </div>
    <template v-for="(x, xi) in form.xs" :key="x.b.$uid">
      <div>
        <label for="b" class="form-label">B</label>
        <div class="flex items-center">
          <input
            id="b"
            type="text"
            v-model="x.b.$value"
            @blur="x.b.$setTouched()"
            class="form-input w-full mr-16"
            :class="{ error: x.b.$hasError }"
          />
          <div class="flex">
            <MinusCircleIcon class="minus-circle mr-4" @click="removeX(xi)" />
            <PlusCircleIcon class="plus-circle" @click="addY(xi)" />
          </div>
        </div>
        <FormErrors :errors="x.b.$errors" class="mt-2" />
      </div>
      <div v-for="(y, yi) in x.ys" :key="y.c.$uid">
        <div class="flex">
          <label for="c" class="form-label w-full mr-8">C</label>
          <label for="d" class="form-label w-full mr-16">D</label>
          <div class="flex hide">
            <MinusCircleIcon class="minus-circle mr-4" />
            <PlusCircleIcon class="plus-circle" />
          </div>
        </div>
        <div class="flex items-center">
          <input
            id="c"
            type="text"
            v-model="y.c.$value"
            @blur="y.c.$setTouched()"
            class="form-input w-full mr-8"
            :class="{ error: y.c.$hasError }"
          />
          <input
            id="d"
            type="text"
            v-model="y.d.$value"
            @blur="y.d.$setTouched()"
            class="form-input w-full mr-16"
            :class="{ error: y.d.$hasError }"
          />
          <div class="flex">
            <MinusCircleIcon
              class="minus-circle mr-4"
              @click="removeY(xi, yi)"
            />
            <PlusCircleIcon class="plus-circle hide" />
          </div>
        </div>
        <div class="flex" v-if="y.c.$hasError || y.d.$hasError">
          <FormErrors :errors="y.c.$errors" class="w-full mt-2 mr-8" />
          <FormErrors :errors="y.d.$errors" class="w-full mt-2 mr-16" />
          <div class="flex hide">
            <MinusCircleIcon class="minus-circle mr-4" />
            <PlusCircleIcon class="plus-circle" />
          </div>
        </div>
      </div>
    </template>
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

const { form, validateFields, resetFields, add, remove } =
  useValidation<FormData>({
    a: {
      $value: '',
      $rules: [rules.required('Please input some text'), rules.random()]
    },
    xs: []
  })

async function handleSubmit() {
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
      $rules: [rules.required('Please input some text'), rules.random()]
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
        rules.required('Please input some text'),
        rules.random(),
        {
          key: `key${++i}`,
          rule: rules.equal('Please select matching values for C and D')
        }
      ]
    },
    d: {
      $value: '',
      $rules: [
        rules.required('Please input some text'),
        rules.random(),
        {
          key: `key${i}`,
          rule: rules.equal('Please select matching values for C and D')
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
.hide {
  @apply opacity-0 pointer-events-none;
}
</style>
