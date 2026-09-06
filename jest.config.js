
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/backend/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['backend/src/services/**/*.ts', 'backend/src/middleware/**/*.ts'],
}
