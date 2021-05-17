<template>
  <h1 class="font-bold text-3xl mb-12">Dynamic Form</h1>
  <form @submit.prevent="handleSubmit()">
    <div>
      <label for="A" class="block font-semibold mb-1">A</label>
      <div class="flex items-center flex-row relative">
        <input
          id="A"
          v-model="form.a.$value"
          type="text"
          class="border p-2 w-10/12"
          @blur="form.a.$onBlur()"
        />
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
      </div>
    </div>
    <div>
      <template v-for="(x, i) in form.xs" :key="x.b.$uid">
        <div class="mt-8 first:mt-12">
          <label :for="`B-${i}`" class="block font-semibold mb-1">B</label>
          <div class="flex items-center flex-row relative">
            <input
              :id="`B-${i}`"
              v-model="x.b.$value"
              type="text"
              class="border p-2 w-10/12"
              @blur="form.a.$onBlur()"
            />
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
          </div>
        </div>
        <div
          v-for="(y, j) in x.ys"
          :key="y.c.$uid"
          class="flex items-center relative mt-4"
        >
          <div class="grid grid-flow-col gap-x-4 w-10/12">
            <input
              v-model="y.c.$value"
              type="text"
              class="border p-2 w-full"
              placeholder="C"
              @blur="form.a.$onBlur()"
            />
            <input
              v-model="y.d.$value"
              type="text"
              class="border p-2 w-full"
              placeholder="D"
              @blur="form.a.$onBlur()"
            />
          </div>
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
        </div>
      </template>
    </div>
    <div class="grid grid-flow-col grid-cols-4 mt-12 gap-x-4 w-full">
      <VButton
        class="primary py-3 px-6 col-span-3"
        type="submit"
        :loading="submitting"
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
import { Field, useValidation, ValidationError } from '../../../main';
import VPreFormData from '../components/common/VPreFormData/VPreFormData.vue';
import VButton from '../components/common/VButton/VButton.vue';
import IconPlusCircle from '../components/icons/IconPlusCircle.vue';
import IconMinusCircle from '../components/icons/IconMinusCircle.vue';

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
    IconMinusCircle
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
        $value: ''
      },
      xs: []
    });

    const addX = () => {
      add(['xs'], {
        b: {
          $value: ''
        },
        ys: []
      });
    };

    const removeX = (i: number) => {
      remove(['xs'], i);
    };

    const addY = (i: number) => {
      add(['xs', i, 'ys'], {
        c: {
          $value: ''
        },
        d: {
          $value: ''
        }
      });
    };

    const removeY = (i: number, j: number) => {
      remove(['xs', i, 'ys'], j);
    };

    const handleSubmit = async () => {
      try {
        const formData = await validateFields();
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
