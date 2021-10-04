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
        })
      ])
    }

    console.log(`Build finished ! (success = ${extractorResult.succeeded})`)
  }
}
