import { log } from 'console'
import shell from 'shelljs'

import { IBoostrapMethodParams } from './IBoostrapMethodParams'



export const skipTests = (
  params: IBoostrapMethodParams,
) => {

  const {
    log,
    files,
  } = params

  const filePatters = [
    /parse\.spec\.ts$/,
    /Http\.spec\.ts$/,
  ]

  log('skiping describe wrappers')

  for(const file of files) {

    let found = false

    for (const pattern of filePatters) {
      if (pattern.test(file)) {
        found = true
        break
      }
    }

    if (found) {
      shell.sed('-i', 'describe', 'describe.skip', file)
    }

  }

  return files

}
