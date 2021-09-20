import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import alias from '@rollup/plugin-alias'
import dts from 'rollup-plugin-dts'
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
  plugins: [
    typescript(),
    alias({
      find: '~',
      replacement: path.resolve(__dirname, 'packages/vue3-form-validation/src')
    })
  ]
})

const dtsConfig = defineConfig({
  input: 'dts/index.d.ts',
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
