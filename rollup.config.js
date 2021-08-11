import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const PUBLISH_BASE = 'publish/dist/vue3-form-validation'

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
  plugins: [
    typescript({
      tsconfig: 'packages/vue3-form-validation/tsconfig.json'
    })
  ]
})

const dtsConfig = defineConfig({
  input: 'tmp/index.d.ts',
  output: [
    {
      file: `${PUBLISH_BASE}.d.ts`,
      format: 'es'
    }
  ],
  plugins: [dts()]
})

export default async () => {
  return [buildConfig, dtsConfig]
}
