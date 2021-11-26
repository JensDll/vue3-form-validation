import path from 'path'
import fs from 'fs-extra'
import { execa } from 'execa'
import { buildFormats, buildTargets } from './meta'

buildTargets.forEach(build)

async function build(target: string) {
  const packageFolder = path.resolve(`packages/${target}`)
  const packageJson = JSON.parse(
    (await fs.readFile(`${packageFolder}/package.json`)).toString()
  )

  if (!packageJson.private) {
    await execa(
      'rollup',
      [
        '--config',
        '--environment',
        `BUILD,TARGETS:${target},FORMATS:${buildFormats.join(' ')}`
      ],
      {
        stdio: 'inherit'
      }
    )

    await execa(
      'npm',
      [
        'exec',
        '--',
        'prettier',
        '--write',
        `${packageFolder}/dist/${target}.d.ts`
      ],
      {
        stdio: 'inherit'
      }
    )

    await Promise.all([
      // Copy LICENSE
      fs.copy('LICENSE', 'publish/LICENSE'),
      // Copy README
      fs.copy('README.md', 'publish/README.md'),
      // Copy JavaScript bundles
      fs.copy(`${packageFolder}/package.json`, 'publish/package.json'),
      ...buildFormats.map(format => {
        const bundle = `${target}.${format}.js`
        return fs.copy(
          `${packageFolder}/dist/${bundle}`,
          `publish/dist/${bundle}`
        )
      }),
      // Copy type definition
      fs.copy(
        `${packageFolder}/dist/${target}.d.ts`,
        `publish/dist/${target}.d.ts`
      )
    ])

    console.log(`Build finished!`)
  }
}
