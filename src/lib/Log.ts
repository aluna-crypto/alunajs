import { Logger } from 'tslog'



export const Log = new Logger({
  name: 'aluna',
  maskValuesOfKeys: ['key', 'secret'],
  minLevel: 'silly',

  // displayDateTime: true,
  // displayLoggerName: true,
  // displayFunctionName: true,
  // displayFilePath: 'hideNodeModulesOnly',

})
