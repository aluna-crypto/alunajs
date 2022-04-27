import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceGetTradableBalanceParams,
  IAlunaBalanceGetTradableBalanceReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/balance/getTradableBalance')



export const getTradableBalance = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceGetTradableBalanceParams,
): Promise<IAlunaBalanceGetTradableBalanceReturns> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new SampleHttp() } = params

  const tradableBalance = await http.authedRequest<number>({
    url: SAMPLE_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    tradableBalance,
    requestCount,
  }

}
