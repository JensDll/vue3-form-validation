import execa from 'execa'
import yargs from 'yargs'

const args = await yargs(process.argv.slice(2)).array('targets').argv
args['targets'] ??= ['vue3-form-validation']

console.log('Running rollup in watch mode ...')

await execa(
  'rollup',
  [
    '--config',
    '--watch',
    '--environment',
    `TARGETS:${args.targets.join(' ')},FORMATS:esm cjs`
  ],
  {
    stdio: 'inherit'
  }
)
