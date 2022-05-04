import { settings } from 'cluster'
import { join } from 'path'
import shell from 'shelljs'

import { AlunaApiFeaturesEnum } from '../../src/lib/enums/AlunaApiFeaturesEnum'
import { IBoostrapMethodParams } from './IBoostrapMethodParams'



export const configureSpecs = (
  params: IBoostrapMethodParams,
) => {

  const {
    log,
    settings,
    paths: { DESTINATION },
    configs: { exchangeLower },
  } = params

  log('configuring specs')

  const specsFilepath = join(DESTINATION, `${exchangeLower}Specs.ts`)

  let search: string | RegExp
  let replace: string | RegExp

  if (!settings.apiFeatures.includes(AlunaApiFeaturesEnum.ORDER_EDITING)) {

    log('configuring order-editing feature specs')

    search = `offersOrderEditing: true,`
    replace = `offersOrderEditing: false,`

    shell.sed('-i', search, replace, specsFilepath)

  }

  if (!settings.apiFeatures.includes(AlunaApiFeaturesEnum.POSITION_ID)) {

    log('configuring position-id feature specs')

    search = `offersPositionId: true,`
    replace = `offersPositionId: false,`

    shell.sed('-i', search, replace, specsFilepath)

  }

}
