import shell from 'shelljs'

import { IBoostrapMethodParams } from './IBoostrapMethodParams'



export const replaceSampleContents = (
  params: IBoostrapMethodParams,
) => {

  const {
    log,
    files,
    configs,
  } = params

  log('replacing strings inside files')

  for(const file of files) {
    shell.sed('-i', /Sample/g, configs.exchangeName, file)
    shell.sed('-i', /SAMPLE/g, configs.exchangeUpper, file)
    shell.sed('-i', /sample/g, configs.exchangeLower, file)
  }

  return files

}
