import execa from 'execa'
import fs from 'fs-extra'

console.log('Running tsc in watch mode ...')
execa('npm', [
  'exec',
  '--',
  'tsc',
  '--declaration',
  'true',
  '--emitDeclarationOnly',
  '--watch',
  '--outDir',
  'dts'
])

// Wait until tsc output exists
await new Promise(resolve => {
  while (!fs.pathExistsSync('dts')) {
    // Wait
  }
  resolve()
})

console.log('Running rollup in watch mode ...')
await execa('rollup', ['--config', 'rollup.config.js', '--watch'])
