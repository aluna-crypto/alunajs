import { log } from 'console'
import shell from 'shelljs'

import { IBoostrapMethodParams } from './IBoostrapMethodParams'



export const deleteLines = (
  params: IBoostrapMethodParams,
) => {

  const {
    log,
    files,
  } = params

  log('uncommenting intentional throws')

  const regex = /^.*(scaffold\:delete-line).*$/mg

  for(const file of files) {
    shell.sed('-i', regex, '', file)
  }

  return files

}
