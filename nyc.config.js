module.exports = {
  extension: ['.ts'],
  include: ['src/**/*.ts'],
  exclude: [
    '**/*.spec.ts',
    '**/test/**',
    '**/*.mock.ts',
  ],
  all: false,
  'skip-full': true,
  'check-coverage': true,
  'report-dir': `${__dirname}/coverage`,
  'temp-dir': `.${__dirname}/nyc`,
  reporter: ['text', 'html', 'text-summary'],
  branches: 100,
  lines: 100,
  functions: 100,
  statements: 100,
}
