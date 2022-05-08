import { filter } from 'lodash'
import { join } from 'path'
import shell from 'shelljs'

import { AlunaAccountEnum } from '../../src/lib/enums/AlunaAccountEnum'
import { replaceSync } from '../utils/replaceSync'
import { IBoostrapMethodParams } from './IBoostrapMethodParams'



export const removePositionFeatures = (
  params: IBoostrapMethodParams,
) => {

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
    const schemaFile = join(DESTINATION, 'schemas', `I${exchangeName}PositionSchema.ts`)

    shell.rm('-rf', methodsDir)
    shell.rm('-f', moduleFile)
    shell.rm('-f', schemaFile)

    const entryAuthedClassPath = join(DESTINATION, `${exchangeName}Authed.ts`)

    log('removing position mentions from authed class')

    const positionSearch = /^.*position.*[\r\n]{1}/img
    const positionReplace = ''

    replaceSync({
      filepath: entryAuthedClassPath,
      search: positionSearch,
      replace: positionReplace,
    })

  }

  const isAPositionMod = /modules\/authed\/position/

  return filter(params.files, (f) => !isAPositionMod.test(f))

}
