import typescript from 'rollup-plugin-typescript2'

const TARGETS = process.env.TARGETS.split(' ')

const configs = []

for (const target of TARGETS) {
  configs.push({
    input: `packages/${target}/src/index.ts`,
    output: [
      {
        file: `packages/${target}/dist/${target}.esm.js`,
        format: 'es'
      },
      {
        file: `packages/${target}/dist/${target}.cjs.js`,
        format: 'cjs'
      }
    ],
    external: ['vue'],
    plugins: [
      typescript({
        tsconfigOverride: {
          exclude: ['**/__tests__', 'scripts']
        }
      })
    ]
  })
}

export default configs
