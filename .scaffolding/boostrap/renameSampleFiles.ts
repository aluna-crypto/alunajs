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

  for(const file of files) {

    const reg = /(sample)[^\/]*\.ts$/mi

    if (reg.test(file)) {

      let to = file
        .replace(/Sample/g, configs.exchangeName)
        .replace(/SAMPLE/g, configs.exchangeUpper)
        .replace(/sample/g, configs.exchangeLower)

      shell.mv(file, to)

      newFilePaths.push(to)

    } else {
      newFilePaths.push(file)
    }

  }

  params.files = newFilePaths

}
