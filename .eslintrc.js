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
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    // https://github.com/typescript-eslint/typescript-eslint/pull/2137
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: { object: false },
        extendDefaults: true
      }
    ]
  }
};
