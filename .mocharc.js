module.exports = {
  // reporter: 'min',
  extension: ['ts'],
  spec: ['src/**/*.spec.ts'],
  require: [
    'ts-node/register',
    'test/mochaHooks.ts',
  ],
  'watch-files': [
    'src/**/*.ts',
  ],
  timeout: 500,
}
