export type Package = {
  name: string
  buildFormats: string[]
}

export const packages: Package[] = [
  {
    name: 'shared',
    buildFormats: ['esm']
  },
  {
    name: 'vue3-form-validation',
    buildFormats: ['esm', 'cjs']
  }
]
