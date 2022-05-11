import {
  filter,
  some,
} from 'lodash'
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
    configs: {
      exchangeName,
      exchangeLower,
    },
  } = params

  const { tradingFeatures } = settings

  const margin = AlunaAccountEnum.MARGIN
  const derivatives = AlunaAccountEnum.DERIVATIVES

  const supportsPositions = some(tradingFeatures, (account) => {

    return (account === margin) || account === derivatives

  })

  if (!supportsPositions) {

    log('removing position modules')

    const methodsDir = join(DESTINATION, 'modules', 'authed', 'position')
    const moduleFile = join(DESTINATION, 'modules', 'authed', 'position.ts')
    const schemaFile = join(DESTINATION, 'schemas', `I${exchangeName}PositionSchema.ts`)
    const fixturesFile = join(DESTINATION, 'test', 'fixtures', `${exchangeLower}Positions.ts`)

    shell.rm('-rf', methodsDir)
    shell.rm('-f', moduleFile)
    shell.rm('-f', schemaFile)
    shell.rm('-f', fixturesFile)


    log('removing position mentions from authed class')

    const entryAuthedClassPath = join(DESTINATION, `${exchangeName}Authed.ts`)
    const entryAuthedClassSpecPath = join(DESTINATION, `${exchangeName}Authed.spec.ts`)

    const positionSearch = /^.*position.*[\r\n]{1}/img
    const positionReplace = ''

    replaceSync({
      filepath: entryAuthedClassPath,
      search: positionSearch,
      replace: positionReplace,
    })

    replaceSync({
      filepath: entryAuthedClassSpecPath,
      search: positionSearch,
      replace: positionReplace,
    })

  }

  const isAPositionMod = /modules\/authed\/position/

  return filter(params.files, (f) => !isAPositionMod.test(f))

}
