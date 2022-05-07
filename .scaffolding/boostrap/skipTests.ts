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

  /**
   * Files matching these patterns will have their root `describe` case marked
   * be mark as `describe.skip`, thus disabling them on purpose to call user
   * attention.
   */
  const filePatterns = [
    /parse\.spec\.ts$/,
    /Http\.spec\.ts$/,
  ]

  log('skiping describe wrappers')

  for(const file of files) {

    let found = false

    for (const pattern of filePatterns) {
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
