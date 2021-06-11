import { Logger } from 'tslog'



export const Log = new Logger({
  name: 'aluna',
  maskValuesOfKeys: ['key', 'secret'],
  minLevel: 'warn',

  // displayDateTime: true,
  // displayLoggerName: true,
  // displayFunctionName: true,
  // displayFilePath: 'hideNodeModulesOnly',

})
