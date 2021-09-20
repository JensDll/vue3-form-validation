import execa from 'execa'

console.log('Running tsc and rollup in watch mode ...')

execa('npm', [
  'exec',
  '--',
  'tsc',
  '--project',
  './packages/vue3-form-validation',
  '--declaration',
  'true',
  '--emitDeclarationOnly',
  '--watch',
  '--outDir',
  'dts'
])

await execa('rollup', ['--config', 'rollup.config.js', '--watch'])
