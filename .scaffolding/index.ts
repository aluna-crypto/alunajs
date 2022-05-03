import inquirer from 'inquirer'

import { AlunaAccountEnum } from '../src/lib/enums/AlunaAccountEnum'
import { AlunaApiFeaturesEnum } from '../src/lib/enums/AlunaApiFeaturesEnum'
import { generate } from './generate'
import { validations } from './validations'



const questions = [
  {
    type: 'input',
    name: 'exchangeName',
    message: "What's the exchange name?",
    validate: validations.notNull,
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
    validate: validations.atLeastOne,
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



export async function main () {

  const answers = await inquirer.prompt(questions)

  await generate(answers)

}


main()
