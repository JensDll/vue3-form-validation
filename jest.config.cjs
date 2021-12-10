/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.[jt]s?(x)'],
  modulePathIgnorePatterns: ['<rootDir>/publish'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/packages/$1/src'
  }
}
