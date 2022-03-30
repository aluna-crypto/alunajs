import Joi from 'joi'
import { values } from 'lodash'

import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'



export const bitfinexGetTradableBalanceParamsSchema = Joi.object({
  symbolPair: Joi
    .string()
    .required(),
  rate: Joi
    .number()
    .required(),
  side: Joi
    .string()
    .valid(...values(AlunaOrderSideEnum))
    .required(),
  account: Joi
    .string()
    .valid(...values(AlunaAccountEnum))
    .required(),
})
