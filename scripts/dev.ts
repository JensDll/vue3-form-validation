import execa from 'execa'
import yargs from 'yargs'

const args = await yargs(process.argv.slice(2)).array('targets').argv

console.log('Running rollup in watch mode ...')
await execa(
  'rollup',
  [
    '--config',
    '--watch',
    '--environment',
    `TARGETS:${args.targets?.join(' ')}`
  ],
  {
    stdio: 'inherit'
  }
)
