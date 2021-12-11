import path from 'path'
import fs from 'fs-extra'
import { execa } from 'execa'
import { packages, Package } from './meta'

packages.forEach(build)

async function build({ name, buildFormats }: Package) {
  const packageFolder = path.resolve(`packages/${name}`)
  const packageJson = JSON.parse(
    (await fs.readFile(`${packageFolder}/package.json`)).toString()
  )

  await execa(
    'rollup',
    [
      '--config',
      '--environment',
      `BUILD,TARGETS:${name},FORMATS:${buildFormats.join(' ')}`
    ],
    {
      stdio: 'inherit'
    }
  )

  console.log(`Finished building ${name}!`)

  if (packageJson.private) {
    return
  }

  console.log()
  console.log('Formatting type definition file ...')
  await execa(
    'npm',
    ['exec', '--', 'prettier', '--write', `${packageFolder}/dist/${name}.d.ts`],
    {
      stdio: 'inherit'
    }
  )

  console.log('Copying relevant files to publish folder ...')
  await Promise.all([
    // Copy LICENSE
    fs.copy('LICENSE', 'publish/LICENSE'),
    // Copy README
    fs.copy('README.md', 'publish/README.md'),
    // Copy package.json
    fs.copy(`${packageFolder}/package.json`, 'publish/package.json'),
    // Copy JavaScript bundles
    ...buildFormats.map(format => {
      const bundle = `${name}.${format}.js`
      return fs.copy(
        `${packageFolder}/dist/${bundle}`,
        `publish/dist/${bundle}`
      )
    }),
    // Copy TypeScript definition file
    fs.copy(`${packageFolder}/dist/${name}.d.ts`, `publish/dist/${name}.d.ts`)
  ])

  console.log('Done!')
}
