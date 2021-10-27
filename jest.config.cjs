/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/__tests__/**/*spec.[jt]s?(x)'],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
}
