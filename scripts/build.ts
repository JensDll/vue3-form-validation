import path from 'path'
import fs from 'fs-extra'
import execa from 'execa'
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'

const targets = fs.readdirSync('packages')
targets.forEach(build)

async function build(target: string) {
  const packageFolder = path.resolve(`packages/${target}`)
  const packageJson = JSON.parse(
    (await fs.readFile(`${packageFolder}/package.json`)).toString()
  )

  if (!packageJson.private) {
    await execa('rollup', ['--config', '--environment', `TARGETS:${target}`], {
      stdio: 'inherit'
    })

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
        ...['esm', 'cjs'].map(format => {
          const bundel = `${target}.${format}.js`
          return fs.copyFile(
            `${packageFolder}/dist/${bundel}`,
            `publish/dist/${bundel}`
          )
        })
      ])
    }
  }
}
