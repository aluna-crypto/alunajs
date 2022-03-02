module.exports = {
  all: true,
  'check-coverage': true,
  extension: ['.ts'],
  include: ['src/**/*.ts'],
  exclude: [
    '**/*.spec.ts',
    '**/test/**',
    '**/*.mock.ts',
  ],
  'report-dir': `${__dirname}/coverage-mocha`,
  'temp-dir': `${__dirname}/coverage-nyc`,
  'skip-full': false,
  reporter: ['text', 'html'],
  branches: 100,
  lines: 100,
  functions: 100,
  statements: 100,
}
