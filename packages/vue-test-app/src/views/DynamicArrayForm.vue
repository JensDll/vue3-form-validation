<template>
  <h1 class="font-bold text-3xl mb-12">Dynamic Array Form</h1>
  <form autocomplete="off" @submit.prevent="handleSubmit()">
    <div>
      <label for="A" class="block font-semibold mb-1">A</label>
      <div class="relative flex items-center">
        <IconPlusCircle
          class="
            w-6
            h-6
            absolute
            right-0
            cursor-pointer
            text-blue-500
            hover:text-blue-700
          "
          @click="addX()"
        />
        <div class="w-10/12">
          <VInput
            id="A"
            v-model="form.a.$value"
            :validating="form.a.$validating"
            :has-error="form.a.$hasError"
            type="text"
            class="border p-3 w-full rounded"
            @blur="form.a.$onBlur()"
          />
        </div>
      </div>
      <div
        v-for="(error, ia) in form.a.$errors"
        :key="ia"
        class="mt-1 text-sm text-red-500"
      >
        {{ error }}
      </div>
    </div>
    <div>
      <template v-for="(x, i) in form.xs" :key="x.b.$uid">
        <div class="mt-8 first:mt-12">
          <label :for="`B-${i}`" class="block font-semibold mb-1">B</label>
          <div class="relative flex items-center">
            <IconPlusCircle
              class="
                w-6
                h-6
                absolute
                right-8
                cursor-pointer
                text-blue-500
                hover:text-blue-700
              "
              @click="addY(i)"
            />
            <IconMinusCircle
              class="
                w-6
                h-6
                absolute
                right-0
                cursor-pointer
                text-red-500
                hover:text-red-700
              "
              @click="removeX(i)"
            />
            <div class="w-10/12">
              <VInput
                :id="`B-${i}`"
                v-model="x.b.$value"
                :validating="x.b.$validating"
                :has-error="x.b.$hasError"
                type="text"
                class="border p-3 w-full rounded"
                @blur="x.b.$onBlur()"
              />
            </div>
          </div>
          <div
            v-for="(error, ib) in x.b.$errors"
            :key="ib"
            class="mt-1 text-sm text-red-500"
          >
            {{ error }}
          </div>
        </div>
        <template v-for="(y, j) in x.ys" :key="y.c.$uid">
          <div class="relative flex items-center mt-4">
            <IconMinusCircle
              class="
                w-6
                h-6
                absolute
                right-0
                cursor-pointer
                text-red-500
                hover:text-red-700
              "
              @click="removeY(i, j)"
            />
            <div class="grid grid-cols-2 w-10/12 gap-x-4">
              <VInput
                v-model="y.c.$value"
                :validating="y.c.$validating"
                :has-error="y.c.$hasError"
                type="text"
                class="border p-3 w-full rounded"
                placeholder="C"
                @blur="y.c.$onBlur()"
              />
              <VInput
                v-model="y.d.$value"
                :validating="y.d.$validating"
                :has-error="y.d.$hasError"
                type="text"
                class="border p-3 w-full rounded"
                placeholder="D"
                @blur="y.d.$onBlur()"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 w-10/12 gap-x-4 mt-1">
            <div>
              <div
                v-for="(error, ic) in y.c.$errors"
                :key="ic"
                class="text-sm text-red-500"
              >
                {{ error }}
              </div>
            </div>
            <div>
              <div
                v-for="(error, id) in y.d.$errors"
                :key="id"
                class="text-sm text-red-500"
              >
                {{ error }}
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
    <div class="grid grid-flow-col grid-cols-4 mt-12 gap-x-4 w-full">
      <VButton
        class="primary py-3 px-6 col-span-3"
        type="submit"
        :disabled="submitting"
      >
        Submit
      </VButton>
      <VButton class="secondary py-3 px-6" @click="resetFields()">
        Reset
      </VButton>
    </div>
  </form>
  <VPreFormData class="mt-20" :form="form" :errors="errors" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Field, useValidation, ValidationError } from 'vue3-form-validation';
import VPreFormData from '../components/common/VPreFormData/VPreFormData.vue';
import VButton from '../components/common/VButton/VButton.vue';
import IconPlusCircle from '../components/icons/IconPlusCircle.vue';
import IconMinusCircle from '../components/icons/IconMinusCircle.vue';
import VInput from '../components/common/VInput/VInput.vue';
import { equal, randomPromise, required } from '../utils';

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

export default defineComponent({
  components: {
    VButton,
    VPreFormData,
    IconPlusCircle,
    IconMinusCircle,
    VInput
  },
  setup() {
    const {
      form,
      errors,
      submitting,
      validateFields,
      resetFields,
      add,
      remove
    } = useValidation<FormData>({
      a: {
        $value: '',
        $rules: [required('A is required'), randomPromise]
      },
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

    let uid = 0;
    const addY = (i: number) => {
      add(['xs', i, 'ys'], {
        c: {
          $value: '',
          $rules: [
            required('C is required'),
            randomPromise,
            {
              key: `key-${i}-${uid}`,
              rule: equal('C and D do not match')
            }
          ]
        },
        d: {
          $value: '',
          $rules: [
            required('D is required'),
            randomPromise,
            {
              key: `key-${i}-${uid}`,
              rule: equal('C and D do not match')
            }
          ]
        }
      });

      uid++;
    };

    const removeY = (i: number, j: number) => {
      remove(['xs', i, 'ys', j]);
    };

    const handleSubmit = async () => {
      try {
        const formData = await validateFields(['c', 'd']);
        console.log(JSON.stringify(formData, null, 2));
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e);
        }
      }
    };

    return {
      form,
      errors,
      submitting,
      handleSubmit,
      resetFields,
      addX,
      removeX,
      addY,
      removeY
    };
  }
});
</script>

<style lang="postcss" scoped></style>
