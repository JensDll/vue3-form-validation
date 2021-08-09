<template>
  <FormProvider
    :form="form"
    :errors="errors"
    title="Dynamic Form"
    @submit="handleSubmit()"
  >
    <div class="field-a">
      <label :for="form.a.$uid" class="label">A</label>
      <div class="input-container">
        <BaseInput
          :id="form.a.$uid"
          v-model="form.a.$value"
          :has-error="form.a.$hasError"
          :validating="form.a.$validating"
          class="input"
          @blur="form.a.$onBlur()"
        />
        <PlusCircleIcon class="plus-icon" @click="addX" />
      </div>
      <ValidationErrors class="validation-errros" :errors="form.a.$errors" />
    </div>
    <template v-for="(x, i) in form.xs" :key="x.b.$uid">
      <div class="field-b">
        <label :for="x.b.$uid" class="label">B</label>
        <div class="input-container">
          <BaseInput
            :id="x.b.$uid"
            v-model="x.b.$value"
            :has-error="x.b.$hasError"
            :validating="x.b.$validating"
            class="input"
            @blur="x.b.$onBlur()"
          />
          <PlusCircleIcon class="plus-icon" @click="addY(i)" />
          <MinusCircleIcon class="minus-icon" @click="removeX(i)" />
        </div>
        <ValidationErrors class="validation-errros" :errors="x.b.$errors" />
      </div>
      <div v-for="(y, j) in x.ys" :key="y.c.$uid" class="field-c-d">
        <div class="field-c">
          <label :for="y.c.$uid" class="label">C</label>
          <BaseInput
            :id="y.c.$uid"
            v-model="y.c.$value"
            :has-error="y.c.$hasError"
            :validating="y.c.$validating"
            class="input"
            @blur="y.c.$onBlur()"
          />
          <ValidationErrors class="validation-errros" :errors="y.c.$errors" />
        </div>
        <div class="field-d">
          <label :for="y.d.$uid" class="label">D</label>
          <div class="input-container">
            <BaseInput
              :id="y.d.$uid"
              v-model="y.d.$value"
              :has-error="y.d.$hasError"
              :validating="y.d.$validating"
              class="input"
              @blur="y.d.$onBlur()"
            />
            <MinusCircleIcon class="minus-icon" @click="removeY(i, j)" />
          </div>
          <ValidationErrors class="validation-errros" :errors="y.d.$errors" />
        </div>
      </div>
    </template>

    <div class="names">
      <div class="label">Select Fields to Validiate</div>
      <div class="name-inputs">
        <div v-for="name in ['a', 'b', 'c', 'd']" :key="name">
          <label class="field-label">
            <input v-model="selectedNames" type="checkbox" :value="name" />
            {{ name }}
          </label>
        </div>
      </div>
    </div>

    <SubmitButtons
      class="buttons"
      gap="2rem"
      ratio="4:2"
      :submitting="submitting"
      @reset="resetFields()"
    />
  </FormProvider>
</template>

<script lang="ts">
import FormProvider from '../components/FormProvider.vue';
import BaseInput from '../components/BaseInput.vue';
import SubmitButtons from '../components/SubmitButtons.vue';
import ValidationErrors from '../components/ValidationErrors.vue';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/vue/outline';

import { ref, watch } from 'vue';
import { required, randomPromise } from '../utils';
import { Field, useValidation, ValidationError } from 'vue3-form-validation';

interface FormData {
  a: Field<string>;
  b: string;
  c: null;
  xs: {
    b: Field<string>;
    ys: {
      c: Field<string>;
      d: Field<string>;
    }[];
  }[];
}

export default {
  components: {
    BaseInput,
    SubmitButtons,
    FormProvider,
    MinusCircleIcon,
    PlusCircleIcon,
    ValidationErrors
  },
  setup() {
    const selectedNames = ref(['a', 'b', 'c', 'd']);
    const {
      form,
      formFields,
      submitting,
      errors,
      validateFields,
      resetFields,
      add,
      remove
    } = useValidation<FormData>({
      a: {
        $value: '',
        $rules: [required('A is required'), randomPromise]
      },
      b: '',
      c: null,
      xs: []
    });

    const addX = () => {
      add(['xs'], {
        b: {
          $value: '',
          $rules: [required('B is required'), randomPromise]
        },
        ys: []
      });
    };

    const removeX = (i: number) => {
      remove(['xs', i]);
    };

    const addY = (i: number) => {
      add(['xs', i, 'ys'], {
        c: {
          $value: '',
          $rules: [required('C is required'), randomPromise]
        },
        d: {
          $value: '',
          $rules: [required('D is required'), randomPromise]
        }
      });
    };

    const removeY = (i: number, j: number) => {
      remove(['xs', i, 'ys', j]);
    };

    const handleSubmit = async () => {
      console.log(formFields.value);
      try {
        const formData = await validateFields(selectedNames.value);
        console.log(formData);
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e.message);
        }
      }
    };

    return {
      form,
      errors,
      submitting,
      validateFields,
      resetFields,
      handleSubmit,
      addX,
      removeX,
      addY,
      removeY,
      selectedNames
    };
  }
};
</script>

<style lang="postcss" scoped>
.validation-errros {
  margin-top: 0.25rem;
}

.input-container {
  display: grid;
  align-items: center;
  justify-items: end;
  grid-template-columns: 1fr 4rem 2rem;
  grid-template-areas: 'input minus-icon plus-icon';
}

.input {
  width: 100%;
}

.plus-icon {
  @apply w-6 h-6 text-blue-500 cursor-pointer;
  grid-area: plus-icon;
}

.plus-icon:hover {
  @apply text-blue-700;
}

.minus-icon {
  @apply w-6 h-6 text-red-500 cursor-pointer;
  grid-area: minus-icon;
}

.minus-icon:hover {
  @apply text-red-700;
}

.field-b {
  margin-top: 3rem;
}

.field-c-d {
  display: grid;
  grid-auto-flow: column;
  gap: 0 2rem;
  margin-top: 1rem;
}

.names {
  margin: 2.5rem 0 1em 0;
}

.name-inputs {
  display: flex;
}

.name-inputs label {
  padding-right: 2rem;
  text-transform: uppercase;
}
</style>
