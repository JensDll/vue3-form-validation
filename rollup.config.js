import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

const TARGETS = process.env.TARGETS.split(' ')
const FORMATS = process.env.FORMATS.split(' ')

const configs = []

const tsconfigOverride = {
  exclude: ['**/__tests__', '**/__mocks__', 'scripts']
}

for (const target of TARGETS) {
  const config = {
    input: `packages/${target}/src/index.ts`,
    output: FORMATS.map(format => ({
      file: `packages/${target}/dist/${target}.${format}.js`,
      format
    })),
    external: ['vue'],
    plugins: [typescript({ tsconfigOverride })]
  }

  const dtsConfig = {
    input: `packages/${target}/dist/index.d.ts`,
    output: {
      file: `packages/${target}/dist/${target}.d.ts`,
      format: 'es'
    },
    plugins: [dts()]
  }

  configs.push(config, dtsConfig)
}

export default configs
