import inquirer from 'inquirer'
import yargs from 'yargs'

import { AlunaAccountEnum } from '../src/lib/enums/AlunaAccountEnum'
import { AlunaApiFeaturesEnum } from '../src/lib/enums/AlunaApiFeaturesEnum'
import {
  bootstrapExchange,
  IPromptAnswers,
} from './bootstrapExchange'
import { inquirerValidations } from './utils/inquirerValidations'



const questions = [
  {
    type: 'input',
    name: 'exchangeName',
    message: "What's the exchange name?",
    validate: inquirerValidations.notNull,
    help: () => '(i.e.: Bitfinex, BitMEX, Gate)',
  },
  {
    type: 'checkbox',
    message: 'Select trading options:"',
    name: 'tradingFeatures',
    choices: [
      { name: 'Exchange', value: AlunaAccountEnum.SPOT },
      { name: 'Margin', value: AlunaAccountEnum.MARGIN },
      { name: 'Derivatives', value: AlunaAccountEnum.DERIVATIVES },
    ],
    validate: inquirerValidations.atLeastOne,
  },
  {
    type: 'checkbox',
    message: 'Select API features:',
    name: 'apiFeatures',
    choices: [
      { name: 'Provides method for editing orders', value: AlunaApiFeaturesEnum.ORDER_EDITING },
      { name: 'Provides uid for positions', value: AlunaApiFeaturesEnum.POSITION_ID },
    ],
  },
]



export function getArgV(): any {

  const { argv } = yargs
    .option('exchangeName', {
      alias: 'e',
      description: 'Exchange Name',
      type: 'string',
    })
    .option('tradingFeatures', {
      alias: 't',
      description: 'Trading Features',
      type: 'string',
    })
    .option('apiFeatures', {
      alias: 'a',
      description: 'API Features',
      type: 'string',
    })
    .help()
    .alias('help', 'h')

  return argv

}



export async function addExchange() {

  const argv: IPromptAnswers = getArgV()
  let answers

  const {
    exchangeName,
    tradingFeatures,
    apiFeatures,
  } = argv

  if (exchangeName && tradingFeatures && apiFeatures) {
    answers = argv
  } else {
    answers = await inquirer.prompt(questions)
  }

  await bootstrapExchange(answers)

}



addExchange()
