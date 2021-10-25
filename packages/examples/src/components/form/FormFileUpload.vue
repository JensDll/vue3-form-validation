<script setup lang="ts">
import { computed, PropType } from 'vue'
import { MinusCircleIcon } from '@heroicons/vue/outline'

import FormErrors from './FormErrors.vue'

type FileHelper = {
  src: string
  file: File
}

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  label: {
    type: String
  },
  modelValue: {
    type: Array as PropType<File[]>,
    required: true
  },
  errors: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  image: {
    type: Boolean
  },
  multiple: {
    type: Boolean
  },
  accept: {
    type: String
  }
})

const hasError = computed(() => props.errors.length > 0)
const files = computed<File[]>({
  get(): File[] {
    return props.modelValue
  },
  set(files) {
    emit('update:modelValue', files)
  }
})
const fileHelpers = computed<FileHelper[]>(() =>
  files.value.map(file => ({
    src: URL.createObjectURL(file),
    file
  }))
)
const isFileSelected = computed<boolean>(() => fileHelpers.value.length > 0)

const removeFile = (i: number) => {
  URL.revokeObjectURL(fileHelpers.value[i].src)
  files.value.splice(i, 1)
}

const unique = (files: File[]) => {
  const lookup = new Set<string>()
  return files.filter(f => {
    const keep = !lookup.has(f.name)
    lookup.add(f.name)
    return keep
  })
}

const handleChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const fileList = input.files
  if (fileList) {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      files.value[i] = file
    }
    files.value = unique(files.value)
  }
  input.value = ''
}
</script>

<template>
  <div>
    <label :for="`file-${label}`" class="form-label">{{ label }}</label>
    <div
      :class="[
        'group relative py-10 form-input border-2 border-dashed rounded grid place-items-center',
        { 'error bg-red-50': hasError }
      ]"
    >
      <input
        :id="`file-${label}`"
        class="w-full h-full absolute opacity-0 cursor-pointer"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleChange"
      />
      <div class="text-center">
        <p>
          <span
            :class="[
              'font-semibold text-indigo-500 group-hover:text-indigo-700',
              { '!text-red-500 group-hover:!text-red-700': hasError }
            ]"
          >
            Upload a file
          </span>
          or drag and drop
        </p>
        <slot></slot>
        <div v-if="image && isFileSelected" class="flex flex-col items-center">
          <template v-for="{ file, src } in fileHelpers" :key="src">
            <img :src="src" class="w-32 h-32 mx-auto mb-2 mt-8" />
            <p>{{ file.name }}</p>
          </template>
        </div>
      </div>
    </div>
    <FormErrors :errors="errors" class="mt-2" />
    <ul v-if="files.length" class="mt-4">
      <li
        v-for="(file, i) in files"
        class="flex items-center cursor-pointer group"
        :key="file.name"
        @click="removeFile(i)"
      >
        <MinusCircleIcon
          class="w-6 h-6 mr-2 text-red-500 group-hover:text-red-700"
        />
        <span class="group-hover:line-through">{{ file.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped></style>
