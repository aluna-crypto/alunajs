module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    "**/exchanges/valr/modules/*.ts",
    "**/exchanges/valr/schemas/parsers*.ts",
  ]
};