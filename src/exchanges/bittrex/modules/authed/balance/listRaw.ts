import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'



const log = debug('@aluna.js:bittrex/balance/listRaw')



// TODO: replace all generic types <any>

export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams,
): Promise<IAlunaBalanceListRawReturns<any>> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new BittrexHttp() } = params

  const rawBalances = await http.authedRequest<any[]>({
    url: BITTREX_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    rawBalances,
    requestCount,
  }

}
