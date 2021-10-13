import path from 'path'
import fs from 'fs-extra'
import execa from 'execa'
import { buildFormats, buildTargets } from './meta'
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'

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

    const extractorConfigPath = path.resolve(
      packageFolder,
      `api-extractor.json`
    )
    const extractorConfig =
      ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
    const extractorResult = Extractor.invoke(extractorConfig, {
      localBuild: true,
      showVerboseMessages: true
    })

    if (extractorResult.succeeded) {
      const globalDtsPath = `${packageFolder}/src/global.d.ts`
      const globalDtsBuffer = await fs.readFile(globalDtsPath)

      await fs.appendFile(
        `${packageFolder}/dist/${target}.d.ts`,
        Buffer.concat([
          Buffer.from('\ndeclare global {'),
          globalDtsBuffer,
          Buffer.from('}')
        ])
      )

      await execa(
        'npm exec --',
        ['prettier', '--write', `${packageFolder}/dist/${target}.d.ts`],
        {
          stdio: 'inherit'
        }
      )

      await Promise.all([
        fs.copyFile('LICENSE', 'publish/LICENSE'),
        fs.copyFile('README.md', 'publish/README.md'),
        fs.copyFile(`${packageFolder}/package.json`, 'publish/package.json'),
        ...buildFormats.map(format => {
          const bundel = `${target}.${format}.js`
          return fs.copyFile(
            `${packageFolder}/dist/${bundel}`,
            `publish/dist/${bundel}`
          )
        }),
        fs.copyFile(globalDtsPath, 'test-dts/global.d.ts')
      ])

      await fs.copy(
        `${packageFolder}/dist/${target}.d.ts`,
        `publish/dist/${target}.d.ts`,
        { overwrite: true }
      )
    }

    console.log(`Build finished ! (success = ${extractorResult.succeeded})`)
  }
}
