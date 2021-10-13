<template>
  <FormProvider
    title="Home Examples"
    :form="form"
    class="form"
    @submit="handleSubmit()"
  >
    <div class="date-range lg:w-2/3">
      <label for="start-date" class="form-label start-label">Start</label>
      <label for="end-date" class="form-label end-label">End</label>
      <input
        type="date"
        id="start-date"
        class="form-input"
        :class="{ error: form.startDate.$hasError }"
        v-model="form.startDate.$value"
        @blur="form.startDate.$setTouched()"
      />
      <FormErrors :errors="form.startDate.$errors" class="mt-2 start-errors" />
      <span class="hyphen">-</span>
      <input
        type="date"
        id="end-date"
        class="form-input"
        :class="{ error: form.endDate.$hasError }"
        v-model="form.endDate.$value"
        @blur="form.endDate.$setTouched()"
      />
      <FormErrors :errors="form.endDate.$errors" class="mt-2 end-errors" />
    </div>
    <FormButtons :submitting="submitting" @reset="resetFields()" class="mt-8" />
  </FormProvider>
</template>

<script setup lang="ts">
import { useValidation, Field } from 'vue3-form-validation'
import FormProvider from '~/components/layout/FormProvider.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import FormButtons from './components/FormButtons.vue'
import { rules } from '~/domain'

type FormData = {
  startDate: Field<string>
  endDate: Field<string>
}

const { form, submitting, validateFields, resetFields } =
  useValidation<FormData>({
    startDate: {
      $value: '',
      $rules: [
        ['submit', rules.required('Please select a starting date')],
        startDate => {
          const now = new Date()
          const start = new Date(startDate)

          if (
            start.getDate() < now.getDate() ||
            start.getMonth() < now.getMonth() ||
            start.getFullYear() < now.getFullYear()
          ) {
            return 'Please select a date in the future'
          }
        },
        { key: 'date' }
      ]
    },
    endDate: {
      $value: '',
      $rules: [
        ['submit', rules.required('Please select an ending date')],
        {
          key: 'date',
          rule: (startDate: string, endDate: string) => {
            const start = new Date(startDate)
            const end = new Date(endDate)

            if (start > end) {
              return 'Please select an end that is later than the starting date'
            }
          }
        }
      ]
    }
  })

async function handleSubmit() {
  try {
    const formData = await validateFields()
    console.log(formData)
  } catch (e) {
    console.log(e)
  } finally {
    form.startDate.$setTouched(false, false)
    form.endDate.$setTouched(false, false)
  }
}
function test() {
  console.log('test')
}
</script>

<style lang="postcss" scoped>
:deep(.form) {
  display: grid;
}

.date-range {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    'start-label . end-label'
    'start-input hyphen end-input'
    'start-errors . end-errors';

  & .start-label {
    grid-area: start-label;
  }

  & .end-label {
    grid-area: end-label;
  }

  & #start-date {
    grid-area: start-input;
  }

  & .hyphen {
    @apply px-4 self-center;
    grid-area: hyphen;
  }

  & #end-date {
    grid-area: end-input;
  }

  & .start-errors {
    grid-area: start-errors;
  }

  & .end-errors {
    grid-area: end-errors;
  }
}
</style>
