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
    help: () => '(i.e.: Bitfinex, BitMEX, GateIO))',
  },
  {
    type: 'checkbox',
    message: 'Select trading options:"',
    name: 'tradingFeatures',
    choices: [
      { name: 'Exchange', value: AlunaAccountEnum.EXCHANGE },
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
      { name: 'Order Editing', value: AlunaApiFeaturesEnum.ORDER_EDITING },
      { name: 'Position ID', value: AlunaApiFeaturesEnum.POSITION_ID },
    ],
  },
]



export function getArgV (): any {

  const argv = yargs
    .option('exchangeName', {
      alias: 'e',
      description: 'Exchange Name',
      type: 'string'
    })
    .option('tradingFeatures', {
      alias: 't',
      description: 'Exchange Features',
      type: 'string'
    })
    .option('apiFeatures', {
      alias: 'a',
      description: 'API Featurs',
      type: 'string'
    })
    .help()
    .alias('help', 'h').argv

  return argv

}



export async function addExchange () {

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
