import chalk from 'chalk'
import debug from 'debug'
import { existsSync } from 'fs'
import inquirer from 'inquirer'
import { merge } from 'lodash'
import { join } from 'path'
import shelljs from 'shelljs'

import { AlunaAccountEnum } from '../src/lib/enums/AlunaAccountEnum'
import { AlunaApiFeaturesEnum } from '../src/lib/enums/AlunaApiFeaturesEnum'
import { addEntryOnExchangesList } from './boostrap/addEntryOnExchangesList'
import { configureSpecs } from './boostrap/configureSpecs'
import { copySampleFiles } from './boostrap/copySampleFiles'
import { IBoostrapMethodParams } from './boostrap/IBoostrapMethodParams'
import { patchAlunaSpec } from './boostrap/patchingAlunaSpec'
import { removePositionFeatures } from './boostrap/removePositionFeatures'
import { renameSampleFiles } from './boostrap/renameSampleFiles'
import { replaceSampleContents } from './boostrap/replaceSampleContents'
import { uncommentIntentionalThrows } from './boostrap/uncommentIntentionalThrows'



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

  const DESTINATION = join(EXCHANGES, exchangeLower)


  /**
   * Conditionally overwritting existing exchange
   */
  if (existsSync(DESTINATION)) {

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
      shelljs.rm('-rf', DESTINATION)
    }
  }


  /**
   * Copying and modifying contents
   */

  const bootstrapParams: IBoostrapMethodParams = {
    log,
    settings,
    files: [],
    paths: {
      ROOT,
      SRC,
      EXCHANGES,
      SAMPLE_EXCHANGE,
      DESTINATION,
    },
    configs: {
      exchangeName,
      exchangeUpper,
      exchangeLower,
    },
  }

  copySampleFiles(bootstrapParams)
  replaceSampleContents(bootstrapParams)
  renameSampleFiles(bootstrapParams)
  configureSpecs(bootstrapParams)
  removePositionFeatures(bootstrapParams)
  addEntryOnExchangesList(bootstrapParams)
  patchAlunaSpec(bootstrapParams)
  uncommentIntentionalThrows(bootstrapParams)


  /**
   * Done.
   */

  console.info('New exchange bootstraped at:\n\t— ', chalk.green(DESTINATION))

}
