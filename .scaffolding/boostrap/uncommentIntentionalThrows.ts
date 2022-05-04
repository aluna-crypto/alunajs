import { log } from 'console'
import shell from 'shelljs'

import { IBoostrapMethodParams } from './IBoostrapMethodParams'



export const uncommentIntentionalThrows = (
  params: IBoostrapMethodParams,
) => {

  const {
    log,
    files,
    configs,
  } = params

  log('uncommenting intentional throws')

  const regex = /^.*(scaffold\:delete).*$/mg

  console.log(regex)

  for(const file of files) {
    console.log(file, regex)
    shell.sed('-i', regex, '', file)
  }

  return files

}
