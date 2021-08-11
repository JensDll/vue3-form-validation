import fs from 'fs-extra'
import execa from 'execa'

await fs.mkdir('publish', { recursive: true })

console.log('Copying Files ...')
await Promise.all([
  fs.copyFile('LICENSE', 'publish/LICENSE'),
  fs.copyFile('README.md', 'publish/README.md'),
  fs.copyFile(
    'packages/vue3-form-validation/package.json',
    'publish/package.json'
  ),
  execa('npm', [
    'exec',
    '--',
    'tsc',
    '--project',
    './packages/vue3-form-validation',
    '--declaration',
    'true',
    '--emitDeclarationOnly',
    '--outDir',
    'tmp'
  ])
])

console.log('Running Rollup ...')
await execa('rollup', ['--config', 'rollup.config.js'])
await fs.remove('tmp')
console.log('Done')
