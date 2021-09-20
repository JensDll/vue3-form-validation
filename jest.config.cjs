module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/__tests__/**/*spec.[jt]s?(x)'],
  moduleNameMapper: {
    '~(.*)': '<rootDir>/packages/vue3-form-validation/src$1'
  }
}
