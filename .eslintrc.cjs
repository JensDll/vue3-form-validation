module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/no-explicit-any.md
    '@typescript-eslint/no-explicit-any': 'off',
    // https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
    '@typescript-eslint/no-non-null-assertion': 'off',
    // https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/ban-types.md
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: { object: false },
        extendDefaults: true
      }
    ],
    // https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/ban-ts-comment.md
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': true,
        'ts-check': false
      }
    ]
  },
  ignorePatterns: ['**/dist']
}
