import fs from 'fs-extra'
import execa from 'execa'

await fs.mkdir('publish', { recursive: true })

console.log('Copy files ...')
await Promise.all([
  fs.copyFile('LICENSE', 'publish/LICENSE'),
  fs.copyFile('README.md', 'publish/README.md'),
  fs.copyFile(
    'packages/vue3-form-validation/package.json',
    'publish/package.json'
  )
])

console.log('Generate dts ...')
await execa('npm', [
  'exec',
  '--',
  'tsc',
  '--declaration',
  'true',
  '--emitDeclarationOnly',
  '--outDir',
  'dts'
])

console.log('Running Rollup ...')
await execa('rollup', ['--config', 'rollup.config.js'])

console.log('Copy dist ...')
await fs.copy('packages/vue3-form-validation/dist', 'publish/dist')

console.log('Done !')
