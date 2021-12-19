import typescript from 'rollup-plugin-typescript2'
import alias from '@rollup/plugin-alias'
import dts from 'rollup-plugin-dts'
import path from 'path'

const TARGETS = process.env.TARGETS.split(' ')
const FORMATS = process.env.FORMATS.split(' ')

const configs = []

for (const target of TARGETS) {
  const tsconfigOverride = {
    include: [`packages/${target}/src`],
    exclude: ['**/__mocks__', '**/__tests__', 'test-dts']
  }

  const config = {
    input: `packages/${target}/src/index.ts`,
    output: FORMATS.map(format => ({
      file: `packages/${target}/dist/${target}.${format}.js`,
      format
    })),
    external: ['vue-demi'],
    plugins: [typescript({ tsconfigOverride })]
  }

  const dtsConfig = {
    input: `packages/${target}/dist/packages/${target}/src/index.d.ts`,
    output: {
      file: `packages/${target}/dist/${target}.d.ts`,
      format: 'es'
    },
    external: ['vue-demi'],
    plugins: [
      alias({
        entries: [
          {
            find: '@/shared',
            replacement: path.resolve(__dirname, 'packages', 'shared')
          }
        ]
      }),
      dts()
    ]
  }

  configs.push(config, dtsConfig)
}

export default configs
