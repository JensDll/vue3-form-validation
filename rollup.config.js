import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import alias from '@rollup/plugin-alias'
import path from 'path'

const PUBLISH_BASE = 'packages/vue3-form-validation/dist/vue3-form-validation'

const buildConfig = defineConfig({
  input: 'packages/vue3-form-validation/src/index.ts',
  output: [
    {
      file: `${PUBLISH_BASE}.esm.js`,
      format: 'es'
    },
    {
      file: `${PUBLISH_BASE}.cjs.js`,
      format: 'cjs'
    }
  ],
  external: ['vue'],
  plugins: [
    alias({
      find: '~',
      replacement: path.resolve(__dirname, 'packages/vue3-form-validation/src')
    }),
    typescript({
      tsconfigOverride: {
        exclude: ['**/__tests__']
      }
    })
  ]
})

export default async args => {
  console.log(args)
  return [buildConfig]
}
