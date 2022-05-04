import { log } from 'console'
import shell from 'shelljs'

import { IBoostrapMethodParams } from './IBoostrapMethodParams'



export const uncommentIntentionalThrows = (
  params: IBoostrapMethodParams,
) => {

  const {
    log,
    files,
  } = params

  log('uncommenting intentional throws')

  const regex = /^.*(scaffold\:delete).*$/mg

  for(const file of files) {
    shell.sed('-i', regex, '', file)
  }

  return files

}
