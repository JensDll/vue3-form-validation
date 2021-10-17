<template>
  <FormProvider
    class="form"
    title="Home Examples"
    :form="form"
    @submit="handleSubmit()"
  >
    <div class="date-range-container lg:w-2/3">
      <label for="start-date" class="form-label start-date-label">Starts</label>
      <label for="end-date" class="form-label end-date-label">Ends By</label>
      <input
        id="start-date"
        class="form-input"
        :class="{ error: form.startDate.$hasError }"
        type="date"
        v-model="form.startDate.$value"
        @blur="form.startDate.$setTouched()"
      />
      <input
        id="end-date"
        class="form-input"
        :class="{ error: form.endDate.$hasError }"
        type="date"
        v-model="form.endDate.$value"
        @blur="form.endDate.$setTouched()"
      />
      <FormErrors
        class="mt-2 start-date-errors"
        :errors="form.startDate.$errors"
      />
      <FormErrors class="mt-2 end-date-errors" :errors="form.endDate.$errors" />
      <span class="hyphen">-</span>
    </div>
    <div class="time-range-container">
      <label for="start-time" class="form-label start-time-label">
        Time Range
      </label>
      <input
        type="time"
        id="start-time"
        class="form-input"
        :class="{ error: form.startTime.$hasError }"
        v-model="form.startTime.$value"
        @blur="form.startTime.$setTouched()"
      />
      <span class="hyphen">-</span>
      <input
        type="time"
        id="end-time"
        class="form-input"
        :class="{ error: form.startTime.$hasError }"
        v-model="form.endTime.$value"
        @blur="form.endTime.$setTouched()"
      />
      <FormErrors
        class="mt-2 time-errors"
        :errors="[...form.startTime.$errors, ...form.endTime.$errors]"
      />
    </div>
    <FormButtons class="mt-4" :submitting="submitting" @reset="resetFields()" />
  </FormProvider>
</template>

<script setup lang="ts">
import { useValidation, Field } from 'vue3-form-validation'

import FormProvider from '~/components/form/FormProvider.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import FormButtons from '~/components/form/FormButtons.vue'
import { rules } from '~/domain'

type FormData = {
  startDate: Field<string>
  endDate: Field<string>
  startTime: Field<string>
  endTime: Field<string>
}

const { form, submitting, validateFields, resetFields } =
  useValidation<FormData>({
    startDate: {
      $value: '',
      $rules: [
        ['submit', rules.required('Please select a starting date')],
        rules.inTheFuture('Please select a date in the future'),
        { key: 'date' }
      ]
    },
    endDate: {
      $value: '',
      $rules: [
        ['submit', rules.required('Please select an ending date')],
        [
          'force',
          {
            key: 'date',
            rule: (startDate: string, endDate: string) => {
              if (endDate && endDate < startDate) {
                return 'Please select an ending date that is later than the starting date'
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

async function handleSubmit() {
  try {
    const formData = await validateFields()
    console.log(formData)
  } catch (e) {
    console.log(e)
  }
}
</script>

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

  & .start-date-label {
    grid-area: start-label;
  }

  & .end-date-label {
    grid-area: end-label;
  }

  & #start-date {
    grid-area: start-input;
  }

  & #end-date {
    grid-area: end-input;
  }

  & .start-date-errors {
    grid-area: start-errors;
  }

  & .end-date-errors {
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

  & #start-time {
    grid-area: start-time;
  }

  & #end-time {
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
