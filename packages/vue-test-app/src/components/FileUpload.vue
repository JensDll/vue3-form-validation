<template>
  <div>
    <label>
      <div class="flex justify-between font-semibold mb-2">
        {{ label }}
      </div>
      <div
        class="
          group
          border-2 border-dashed
          py-10
          rounded
          flex
          justify-center
          items-center
          relative
        "
        :class="{ 'bg-red-50 border-red-300': hasError }"
      >
        <input
          class="group w-full h-full absolute opacity-0 cursor-pointer"
          type="file"
          multiple
          @change="handleChange"
        />
        <div class="text-center">
          <p>
            <span
              class="text-indigo-500 font-semibold group-hover:text-indigo-400"
              :class="{ 'text-red-500 group-hover:text-red-400': hasError }"
            >
              Upload a file
            </span>
            or drag and drop
          </p>
          <p class="text-gray-500 text-xs mb-2">TFLITE + Label File</p>
        </div>
      </div>
    </label>
    <ul class="mt-4">
      <li
        v-for="(file, i) in files"
        :key="file.name"
        class="flex items-center cursor-pointer group"
        @click="removeFile(i)"
      >
        <span class="group-hover:line-through">{{ file.name }}</span>
        <MinusCircleIcon
          class="w-5 h-5 text-red-500 ml-2 group-hover:text-red-700"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { markRaw, ref } from 'vue';
import { MinusCircleIcon } from '@heroicons/vue/outline';

const props = defineProps({
  label: {
    type: String
  },
  hasError: {
    type: Boolean,
    default: false
  }
});

const files = ref<File[]>([]);

const removeFile = (i: number) => {
  files.value.splice(i, 1);
  emit('update:modelValue', [...files.value]);
};

const unique = (files: File[]) => {
  const lookup = new Set<string>();
  return files.filter(f => {
    const keep = !lookup.has(f.name);
    lookup.add(f.name);
    return keep;
  });
};

const emit = defineEmits(['update:modelValue']);
const handleChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const fileList = input.files;
  if (fileList) {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      files.value.push(markRaw(file));
    }
    files.value = unique(files.value);
    emit('update:modelValue', files.value);
  }
};
</script>
