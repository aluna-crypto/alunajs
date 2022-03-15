import Joi from 'joi'



export const bitmexGetTradableBalanceParamsSchema = Joi.object({
  symbolPair: Joi
    .string()
    .required(),
}).options({
  stripUnknown: true,
})
