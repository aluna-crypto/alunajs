import chalk from 'chalk'
import debug from 'debug'
import { existsSync } from 'fs'
import { merge } from 'lodash'
import { join } from 'path'
import shelljs from 'shelljs'

import { AlunaAccountEnum } from '../src/lib/enums/AlunaAccountEnum'
import { AlunaApiFeaturesEnum } from '../src/lib/enums/AlunaApiFeaturesEnum'



const log = debug('@aluna.js:scaffold')



export interface IPromptAnswers {
  exchangeName: string
  tradingFeatures: AlunaAccountEnum[]
  apiFeatures: AlunaApiFeaturesEnum[]
}

export interface IScaffoldSettings extends IPromptAnswers {
  exchangePascal: string
  exchangeUpper: string
  exchangeLower: string
}



const ROOT = join(__dirname, '..')
const SRC = join(ROOT, 'src')
const EXCHANGES = join(SRC, 'exchanges')
const SAMPLE_EXCHANGE = join(EXCHANGES, 'sample')



export function buildSettings (params: {
  answers: IPromptAnswers,
}): IScaffoldSettings {

  const { answers } = params
  const { exchangeName } = answers

  const exchangeId = exchangeName.toLowerCase()
  const exchangePascal = exchangeId.replace(/\b\w/g, l => l.toUpperCase())
  const exchangeUpper = exchangeId.toUpperCase()
  const exchangeLower = exchangeId.toLowerCase()

  const settings: IScaffoldSettings = merge({}, answers, {
    exchangePascal,
    exchangeUpper,
    exchangeLower,
  })

  return settings

}



export async function generate (answers: IPromptAnswers) {

  const settings = buildSettings({ answers })

  const {
    exchangeName,
    exchangePascal,
    exchangeUpper,
    exchangeLower,
  } = settings

  log('generate', { settings })

  const destination = join(EXCHANGES, exchangeLower)

  if (existsSync(destination)) {
    console.error(chalk.red(`Destination path exists, aborting.`))
    console.error(`\t— ${destination}`)
    return
    process.exit()
  }

  log('copying sample files')

  shelljs.cp('-R', SAMPLE_EXCHANGE, destination)

  const files = shelljs.find(destination)
    .filter((file) => file.match(/\.ts$/))

  // replace strings inside files
  log('replacing strings inside files')

  for(const file of files) {
    shelljs.sed('-i', /sample/g, exchangeLower, file)
    shelljs.sed('-i', /Sample/g, exchangePascal, file)
    shelljs.sed('-i', /SAMPLE/g, exchangeUpper, file)
    shelljs.sed('-i', /sample/g, exchangeLower, file)
  }

  // rename files
  log('renaming files')

  for(const file of files) {

    if (/(sample)[^\/]*\.ts$/mi.test(file)) {

      let to = file
        .replace('sample', exchangeLower)
        .replace('Sample', exchangePascal)
        .replace('SAMPLE', exchangeUpper)
        .replace('sample', exchangeLower)

      shelljs.mv(file, to)

      log('mv', { file, to })

    }
  }

  // specs configuration

  let search: string | RegExp
  let replace: string | RegExp

  const specsFilepath = join(destination, `${exchangeLower}Specs.ts`)

  if (!settings.apiFeatures.includes(AlunaApiFeaturesEnum.ORDER_EDITING)) {

    log('configuring order-editing feature specs')

    search = `offersOrderEditing: true,`
    replace = `offersOrderEditing: false,`

    shelljs.sed('-i', search, replace, specsFilepath)

  }

  if (!settings.apiFeatures.includes(AlunaApiFeaturesEnum.POSITION_ID)) {

    log('configuring position-id feature specs')

    search = `offersPositionId: true,`
    replace = `offersPositionId: false,`

    shelljs.sed('-i', search, replace, specsFilepath)


    log('removing position modules')

    const methodsDir = join(destination, 'modules', 'authed', 'position')
    const moduleFile = join(destination, 'modules', 'authed', 'position.ts')

    shelljs.rm('-rf', methodsDir)
    shelljs.rm(moduleFile)


    const entryAuthedClass = join(destination, `${exchangePascal}Authed.ts`)

    log('removing position module import authed class')

    search = new RegExp(
      `import { position } from './modules/authed/position'[\n\r]*`,
      'mg'
    )
    replace = ''

    // TODO: Fix this
    shelljs.sed('-i', search, replace, entryAuthedClass)

    log('disconnecting position module in authed class')

    search = new RegExp(`this.position = position(this)`)
    replace = ''

    // TODO: Fix this
    shelljs.sed('-i', search, replace, entryAuthedClass)

  }

}
