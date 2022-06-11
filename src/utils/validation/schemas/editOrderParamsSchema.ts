import Joi from 'joi'
import {
  filter,
  values,
} from 'lodash'

import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'



export const editOrderParamsSchema = Joi.object({
  id: Joi
    .string()
    .required(),
  symbolPair: Joi
    .string()
    .required(),
  account: Joi
    .string()
    .valid(...values(AlunaAccountEnum))
    .required(),
  type: Joi
    .string()
    .valid(...filter(values(AlunaOrderTypesEnum), (t) => t !== AlunaOrderTypesEnum.MARKET))
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
  clientOrderId: Joi
    .string()
    .optional(),
  newClientOrderId: Joi
    .string()
    .optional(),
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
  http: Joi
    .object()
    .optional(),
})
