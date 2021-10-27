module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/hooks.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
