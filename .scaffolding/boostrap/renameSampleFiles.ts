import { each } from 'lodash'
import shell from 'shelljs'

import { IBoostrapMethodParams } from './IBoostrapMethodParams'



export const renameSampleFiles = (
  params: IBoostrapMethodParams,
) => {

  const {
    configs,
    files,
  } = params

  const newFilePaths: string[] = []

  each(files, (file) => {

    const reg = /(sample)[^/]*\.ts$/mi

    if (reg.test(file)) {

      const to = file
        .replace(/Sample/g, configs.exchangeName)
        .replace(/SAMPLE/g, configs.exchangeUpper)
        .replace(/sample/g, configs.exchangeLower)

      shell.mv(file, to)

      newFilePaths.push(to)

    } else {
      newFilePaths.push(file)
    }

  })

  return newFilePaths

}
