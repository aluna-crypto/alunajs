import { each } from 'lodash'
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

  const regex = /^.*(scaffold:delete-line).*$/mg

  each(files, (file) => {
    shell.sed('-i', regex, '', file)
  })

}
