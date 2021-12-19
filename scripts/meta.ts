export type Package = {
  name: string
  buildFormats: string[]
}

export const packages: Package[] = [
  {
    name: 'shared',
    buildFormats: ['esm']
  }
  // {
  //   name: 'compose-validation',
  //   buildFormats: ['esm', 'cjs']
  // }
]
