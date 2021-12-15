import yargs from 'yargs'

import { run } from './utils'

const args = await yargs(process.argv.slice(2)).array('targets').argv
args['targets'] ??= ['shared', 'vue3-form-validation']

console.log('Running rollup in watch mode ...')

await run('rollup', [
  '--config',
  '--watch',
  '--environment',
  `TARGETS:${args.targets.join(' ')},FORMATS:esm`
])
