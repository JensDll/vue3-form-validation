import typescript from 'rollup-plugin-typescript2'
import esbuild from 'rollup-plugin-esbuild'

const TARGETS = process.env.TARGETS.split(' ')
const FORMATS = process.env.FORMATS.split(' ')

const configs = []

const tsconfigOverride = {
  exclude: ['**/__tests__', 'scripts']
}

for (const target of TARGETS) {
  const config = {
    input: `packages/${target}/src/index.ts`,
    external: ['vue'],
    plugins: [
      process.env.BUILD
        ? typescript({ tsconfigOverride })
        : esbuild(tsconfigOverride)
    ]
  }

  const output = FORMATS.map(format => ({
    file: `packages/${target}/dist/${target}.${format}.js`,
    format
  }))

  config['output'] = output

  configs.push(config)
}

export default configs
