import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'



const log = debug('@aluna.js:bittrex/balance/list')



export const list = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams,
): Promise<IAlunaBalanceListReturns> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new BittrexHttp() } = params

  const balances = await http.authedRequest<IAlunaBalanceSchema[]>({
    url: BITTREX_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    balances,
    requestCount,
  }

}
