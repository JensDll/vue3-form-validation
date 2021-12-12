<script setup lang="ts">
import { useValidation, Field } from 'vue3-form-validation'

import FormProvider from '~/components/form/FormProvider.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import FormButtons from '~/components/form/FormButtons.vue'
import FormInput from '~/components/form/FormInput.vue'
import { rules } from '~/utils'

type FormData = {
  startDate: Field<string>
  endDate: Field<string>
  startTime: Field<string>
  endTime: Field<string>
}

const {
  form,
  hasError,
  errors,
  validating,
  submitting,
  validateFields,
  resetFields
} = useValidation<FormData>({
  startDate: {
    $value: '',
    $rules: [
      ['submit', rules.required('Please select a starting date')],
      ['change', rules.inTheFuture('Please select a date in the future')],
      { key: 'date' }
    ]
  },
  endDate: {
    $value: '',
    $rules: [
      ['submit', rules.required('Please select an ending date')],
      [
        'change',
        {
          key: 'date',
          rule: (startDate: string, endDate: string) => {
            if (startDate.length === endDate.length && endDate < startDate) {
              return 'Please select an ending date later than the starting date'
            }
          }
        }
      ]
    ]
  },
  startTime: {
    $value: '',
    $rules: [
      {
        key: 'time',
        rule: rules.allRequired('Please select a time range')
      }
    ]
  },
  endTime: {
    $value: '',
    $rules: [{ key: 'time' }]
  }
})

function handleReset() {
  resetFields()
  form.startDate.$touched = true
  form.endDate.$touched = true
}

handleReset()

async function handleSubmit() {
  try {
    const formData = await validateFields()
    console.log(formData)
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <FormProvider
    class="form"
    title="Keyed Rules"
    :validating="validating"
    :submitting="submitting"
    :has-error="hasError"
    :errors="errors"
    :form="form"
    @submit="handleSubmit()"
  >
    <div class="date-range-container">
      <FormInput
        type="date"
        :label="{
          value: 'Starts',
          for: 'start-date'
        }"
        :classes="{
          label: 'start-date-label',
          input: 'start-date-input',
          error: 'start-date-errors'
        }"
        :errors="form.startDate.$errors"
        v-model="form.startDate.$value"
        @blur="form.startDate.$validate()"
      />
      <FormInput
        type="date"
        :label="{
          value: 'Ends By',
          for: 'end-date'
        }"
        :classes="{
          label: 'end-date-label',
          input: 'end-date-input',
          error: 'end-date-errors'
        }"
        :errors="form.endDate.$errors"
        v-model="form.endDate.$value"
        @blur="form.endDate.$validate()"
      />
      <span class="hyphen">-</span>
    </div>
    <div class="time-range-container">
      <label for="start-time" class="form-label start-time-label">
        Time Range
      </label>
      <FormInput
        type="time"
        :classes="{
          input: 'start-time-input'
        }"
        :has-error="form.startTime.$hasError"
        v-model="form.startTime.$value"
      />
      <FormInput
        type="time"
        :classes="{
          input: 'end-time-input'
        }"
        :has-error="form.startTime.$hasError"
        v-model="form.endTime.$value"
      />
      <span class="hyphen">-</span>
      <FormErrors
        class="mt-2 time-errors"
        :errors="[...form.startTime.$errors, ...form.endTime.$errors]"
      />
    </div>
    <FormButtons class="mt-4" :submitting="submitting" @reset="handleReset()" />
  </FormProvider>
</template>

<style lang="postcss" scoped>
:deep(.form) {
  @apply grid gap-y-6;
}

.date-range-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    'start-label . end-label'
    'start-input hyphen end-input'
    'start-errors . end-errors';

  & :deep(.start-date-label) {
    grid-area: start-label;
  }

  & :deep(.end-date-label) {
    grid-area: end-label;
  }

  & :deep(.start-date-input) {
    grid-area: start-input;
  }

  & :deep(.end-date-input) {
    grid-area: end-input;
  }

  & :deep(.start-date-errors) {
    grid-area: start-errors;
  }

  & :deep(.end-date-errors) {
    grid-area: end-errors;
  }
}

.time-range-container {
  display: grid;
  grid-template-columns: auto auto auto 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    'label label label label'
    'start-time hyphen end-time .'
    'errors errors errors errors';

  & .start-time-label {
    grid-area: label;
  }

  & :deep(.start-time-input) {
    grid-area: start-time;
  }

  & :deep(.end-time-input) {
    grid-area: end-time;
  }

  & .time-errors {
    grid-area: errors;
  }
}

.hyphen {
  @apply px-4 self-center justify-self-start;
  grid-area: hyphen;
}
</style>
