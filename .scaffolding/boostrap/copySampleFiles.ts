import shell from 'shelljs'

import { IBoostrapMethodParams } from './IBoostrapMethodParams'



export const copySampleFiles = (params: IBoostrapMethodParams) => {


  const {
    log,
    paths: {
      SAMPLE_EXCHANGE,
      DESTINATION,
    }
  } = params

  log('copying sample files')

  shell.cp('-R', SAMPLE_EXCHANGE, DESTINATION)

  const files = shell.find(DESTINATION)
    .filter((file) => file.match(/\.ts$/))

  params.files = files

}
