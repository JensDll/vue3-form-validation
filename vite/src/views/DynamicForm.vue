<template>
  <h1>Dynamic Form</h1>
  <form
    class="form mb-8 mt-10 gap-y-4 gap-x-6 items-start"
    @submit.prevent="handleSubmit"
  >
    <BaseInput
      v-model="form.a.$value"
      label="A"
      :errors="form.a.$errors"
      :validating="form.a.$validating"
      class="col-span-10"
      @blur="form.a.$onBlur()"
    />
    <BaseButton class="col-span-3 mb-2 form-button" @click="addX">
      Add X
    </BaseButton>
    <template v-for="(x, indexX) in form.xs" :key="x.b.$uid">
      <BaseInput
        v-model="x.b.$value"
        label="B"
        :errors="x.b.$errors"
        :validating="x.b.$validating"
        class="col-span-7"
        @blur="x.b.$onBlur()"
      />
      <BaseButton class="col-span-3 form-button" @click="addY(indexX)">
        Add Y
      </BaseButton>
      <BaseButton class="col-span-3 form-button" @click="removeX(indexX)">
        Remove X
      </BaseButton>
      <template v-for="(y, indexY) in x.ys" :key="y.c.$uid">
        <BaseInput
          v-model="y.c.$value"
          label="C"
          :errors="y.c.$errors"
          :validating="y.d.$validating"
          class="col-span-5"
          @blur="y.c.$onBlur()"
        />
        <BaseInput
          v-model="y.d.$value"
          label="D"
          :errors="y.d.$errors"
          :validating="y.d.$validating"
          class="col-span-5"
          @blur="y.d.$onBlur()"
        />
        <BaseButton
          class="col-span-3 form-button"
          @click="removeY(indexX, indexY)"
        >
          Remove Y
        </BaseButton>
      </template>
    </template>
    <div class="col-span-full flex gap-x-6 mt-8">
      <BaseButton
        class="w-full py-3"
        type="primary"
        html-type="submit"
        :disabled="submitting"
      >
        Submit
      </BaseButton>
      <BaseButton class="w-full py-3" @click="resetFields">Reset</BaseButton>
    </div>
  </form>
  <PreFormData :form="form" :errors="errors" />
</template>

<script lang="ts">
import { Field, useValidation } from '../../../main';
import PreFormData from '../components/PreFormData.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import { ref } from 'vue';

type FormData = {
  a: Field<string>;
  xs: {
    b: Field<string>;
    ys: {
      c: Field<string>;
      d: Field<string>;
    }[];
  }[];
};

export default {
  components: { BaseInput, BaseButton, PreFormData },
  setup() {
    const randomInt = (min: number, max: number) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const randomPromise = (x: string) => {
      const ms = randomInt(300, 2000);

      return new Promise<void | string>(resolve => {
        setTimeout(() => {
          if (x) {
            resolve();
          } else {
            resolve(`Promise ${ms} ms`);
          }
        }, ms);
      });
    };

    const {
      form,
      submitting,
      errors,
      validateFields,
      resetFields,
      add,
      remove
    } = useValidation<FormData>({
      a: {
        $value: ref(''),
        $rules: [a => !a && 'A is required', randomPromise]
      },
      xs: []
    });

    const addX = () => {
      add(['xs'], {
        b: {
          $value: '',
          $rules: [b => !b && 'B is required', randomPromise]
        },
        ys: []
      });
    };

    const removeX = (indexX: number) => {
      remove(['xs'], indexX);
    };

    const addY = (indexX: number) => {
      add(['xs', indexX, 'ys'], {
        c: {
          $value: '',
          $rules: [c => !c && 'C is required', randomPromise]
        },
        d: {
          $value: '',
          $rules: [d => !d && 'D is required', randomPromise]
        }
      });
    };

    const removeY = (indexX: number, indexY: number) => {
      remove(['xs', indexX, 'ys'], indexY);
    };

    const handleSubmit = () => {
      validateFields()
        .then(formData => {
          console.log(JSON.stringify(formData, null, 2));
        })
        .catch(() => {
          // validation error
        });
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
      removeY
    };
  }
};
</script>

<style scoped>
.form {
  display: grid;
  grid-template-columns: repeat(13, 1fr);
}

.form-button {
  @apply py-1;
  margin-top: 28px;
}
</style>
