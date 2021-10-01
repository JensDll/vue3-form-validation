import path from 'path'
import fs from 'fs-extra'
import execa from 'execa'
import { packageNames } from './utils.js'
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'

async function build(packageName) {
  const packageFolder = path.resolve(`packages/${packageName}`)
  const packageJson = JSON.parse(
    await fs.readFile(`${packageFolder}/package.json`)
  )

  if (!packageJson.private) {
    await execa('rollup', ['--config', '--environment', 'FORMATS'], {
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

    console.log(extractorResult)
  }
}

packageNames.forEach(build)
