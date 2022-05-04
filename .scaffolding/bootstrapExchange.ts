import chalk from 'chalk'
import debug from 'debug'
import {
  existsSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import inquirer from 'inquirer'
import { merge } from 'lodash'
import { join } from 'path'
import shelljs from 'shelljs'

import { AlunaAccountEnum } from '../src/lib/enums/AlunaAccountEnum'
import { AlunaApiFeaturesEnum } from '../src/lib/enums/AlunaApiFeaturesEnum'



const log = debug('@aluna.js:scaffold/generate')



export interface IPromptAnswers {
  exchangeName: string
  tradingFeatures: AlunaAccountEnum[]
  apiFeatures: AlunaApiFeaturesEnum[]
}

export interface IScaffoldSettings extends IPromptAnswers {
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
  const exchangeUpper = exchangeId.toUpperCase()
  const exchangeLower = exchangeId.toLowerCase()

  const settings: IScaffoldSettings = merge({}, answers, {
    exchangeName,
    exchangeUpper,
    exchangeLower,
  })

  return settings

}



export async function bootstrapExchange (answers: IPromptAnswers) {

  const settings = buildSettings({ answers })

  const {
    exchangeName,
    exchangeUpper,
    exchangeLower,
  } = settings

  log('generate', { settings })

  const destination = join(EXCHANGES, exchangeLower)


  /**
   * Conditionally overwritting existing exchange
   */
  if (existsSync(destination)) {

    console.error(chalk.red(`Destination path exists.`))

    const question = [{
      type: 'expand',
      message: 'Do you want to overrite it?',
      name: 'overwrite',
      choices: [
        { key: 'y', name: 'Yes, please.', value: true },
        { key: 'n', name: 'No way!', value: false },
      ],
      default: 1,
    }]

    const answer = await inquirer.prompt(question)

    const { overwrite } = answer

    if (!overwrite) {
      console.error(chalk.gray(`Aborting.`))
      process.exit()
    } else {
      shelljs.rm('-rf', destination)
    }
  }


  /**
   * Sample files
   */
  log('copying sample files')

  shelljs.cp('-R', SAMPLE_EXCHANGE, destination)

  const files = shelljs.find(destination)
    .filter((file) => file.match(/\.ts$/))


  /**
   * Sample strings inside files
   */
  log('replacing strings inside files')

  for(const file of files) {
    shelljs.sed('-i', /Sample/g, exchangeName, file)
    shelljs.sed('-i', /SAMPLE/g, exchangeUpper, file)
    shelljs.sed('-i', /sample/g, exchangeLower, file)
  }


  /**
   * Sample filenames
   */
  log('renaming files')

  for(const file of files) {

    const reg = /(sample)[^\/]*\.ts$/mi

    if (reg.test(file)) {

      let to = file
        .replace(/Sample/g, exchangeName)
        .replace(/SAMPLE/g, exchangeUpper)
        .replace(/sample/g, exchangeLower)

      shelljs.mv(file, to)

    }

  }


  /**
   * Specs configuration
   */
  log('configuring specs')

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

  }


  /**
   * Conditionally removing position modules
   */
  if (!settings.tradingFeatures.includes(AlunaAccountEnum.MARGIN)) {

    log('removing position modules')

    const methodsDir = join(destination, 'modules', 'authed', 'position')
    const moduleFile = join(destination, 'modules', 'authed', 'position.ts')

    shelljs.rm('-rf', methodsDir)
    shelljs.rm('-f', moduleFile)

    const entryAuthedClassPath = join(destination, `${exchangeName}Authed.ts`)
    const entryAuthedClassContents = readFileSync(entryAuthedClassPath, 'utf8')

    log('removing position mentions from authed class')

    const positionMentions = /^.*position.*[\r\n]{1}/img

    const newEntryAuthedClassContents = entryAuthedClassContents
      .replace(positionMentions, '')

    writeFileSync(entryAuthedClassPath, newEntryAuthedClassContents)

  }

  console.info('New exchange bootstraped at:\n\t— ', chalk.green(destination))
}



export const replaceSync = (params: {
  search: string | RegExp,
  replace: string,
  filepath: string,
}) => {

  const {
    filepath,
    replace,
    search,
  } = params

  const contents = readFileSync(filepath, 'utf8')
  const newContents = contents.replace(search, replace)

  writeFileSync(filepath, newContents)

}
