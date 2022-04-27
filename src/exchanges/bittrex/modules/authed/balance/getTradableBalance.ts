import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceGetTradableBalanceParams,
  IAlunaBalanceGetTradableBalanceReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'



const log = debug('@aluna.js:bittrex/balance/getTradableBalance')



export const getTradableBalance = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceGetTradableBalanceParams,
): Promise<IAlunaBalanceGetTradableBalanceReturns> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new BittrexHttp() } = params

  const tradableBalance = await http.authedRequest<number>({
    url: BITTREX_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    tradableBalance,
    requestCount,
  }

}
