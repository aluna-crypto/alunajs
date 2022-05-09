import { debug } from 'debug'
import Joi from 'joi'
import { values } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import {
  IAlunaBalanceGetTradableBalanceParams,
  IAlunaBalanceGetTradableBalanceReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { translateToBitfinex } from '../../../enums/adapters/bitfinexAccountsAdapter'



const log = debug('@alunajs:bitfinex/balance/getTradableBalance')



export const getTradableBalance = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceGetTradableBalanceParams,
): Promise<IAlunaBalanceGetTradableBalanceReturns> => {

  log('getting tradable balance', params)

  validateParams({
    params,
    schema: Joi.object({
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
    }),
  })

  const {
    settings,
    credentials,
  } = exchange

  const {
    rate,
    side,
    account,
    symbolPair,
    http = new BitfinexHttp(settings),
  } = params

  log(`fetching Bitfinex tradable balance for ${symbolPair}`)

  const translatedAccount = translateToBitfinex({
    from: account!,
  })

  const dir = side === AlunaOrderSideEnum.BUY
    ? 1
    : -1

  const [tradableBalance] = await http.authedRequest({
    credentials,
    url: getBitfinexEndpoints(settings).balance.getTradableBalance,
    body: {
      dir,
      symbol: symbolPair,
      rate: rate!.toString(),
      type: translatedAccount,
    },
  })

  const { requestCount } = http

  return {
    tradableBalance,
    requestCount,
  }

}
