import Joi from 'joi'
import { values } from 'lodash'

import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderPlaceParams } from '../../../lib/modules/authed/IAlunaOrderModule'



export const placeOrderParamsSchema = Joi.object<IAlunaOrderPlaceParams>({
  symbolPair: Joi
    .string()
    .required(),
  account: Joi
    .string()
    .valid(...values(AlunaAccountEnum))
    .required(),
  type: Joi
    .string()
    .valid(...values(AlunaOrderTypesEnum))
    .required(),
  side: Joi
    .string()
    .valid(...values(AlunaOrderSideEnum))
    .required(),
  amount: Joi
    .number()
    .required(),
  rate: Joi
    .number()
    .when('type', {
      is: AlunaOrderTypesEnum.LIMIT,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
  stopRate: Joi
    .number()
    .when('type', {
      is: [AlunaOrderTypesEnum.STOP_LIMIT, AlunaOrderTypesEnum.STOP_MARKET],
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
  limitRate: Joi
    .number()
    .when('type', {
      is: AlunaOrderTypesEnum.STOP_LIMIT,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .options({
      stripUnknown: true,
    }),
})
