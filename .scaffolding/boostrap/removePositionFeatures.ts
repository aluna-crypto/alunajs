import { settings } from 'cluster'
import { log } from 'console'
import { readFileSync } from 'fs'
import { join } from 'path'
import shell from 'shelljs'

import { AlunaAccountEnum } from '../../src/lib/enums/AlunaAccountEnum'
import { replaceSync } from '../utils/replaceSync'
import { IBoostrapMethodParams } from './IBoostrapMethodParams'



export const removePositionFeatures = (
  params: IBoostrapMethodParams,
) => {

  let search: string | RegExp
  let replace: string | RegExp

  const {
    log,
    settings,
    paths: { DESTINATION },
    configs: { exchangeName },
  } = params

  if (!settings.tradingFeatures.includes(AlunaAccountEnum.MARGIN)) {

    log('removing position modules')

    const methodsDir = join(DESTINATION, 'modules', 'authed', 'position')
    const moduleFile = join(DESTINATION, 'modules', 'authed', 'position.ts')

    shell.rm('-rf', methodsDir)
    shell.rm('-f', moduleFile)

    const entryAuthedClassPath = join(DESTINATION, `${exchangeName}Authed.ts`)
    const entryAuthedClassContents = readFileSync(entryAuthedClassPath, 'utf8')

    log('removing position mentions from authed class')

    const positionSearch = /^.*position.*[\r\n]{1}/img
    const positionReplace = ''

    replaceSync({
      filepath: entryAuthedClassPath,
      search: positionSearch,
      replace: positionReplace,
    })

  }

}
