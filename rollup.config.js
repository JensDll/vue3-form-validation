import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import fs from 'fs-extra'

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
    },
    {
      file: `${PUBLISH_BASE}.d.ts`,
      format: 'es'
    }
  ],
  plugins: [
    typescript({
      tsconfig: 'packages/vue3-form-validation/tsconfig.json'
    }),
    dts()
  ]
})

export default async () => {
  await fs.mkdir('publish', { recursive: true })
  await Promise.all([
    fs.copyFile('LICENSE', 'publish/LICENSE'),
    fs.copyFile('README.md', 'publish/README.md'),
    fs.copyFile(
      'packages/vue3-form-validation/package.json',
      'publish/package.json'
    )
  ])
  return buildConfig
}
