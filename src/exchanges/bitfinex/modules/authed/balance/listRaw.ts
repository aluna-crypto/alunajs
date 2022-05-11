import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { IBitfinexBalanceSchema } from '../../../schemas/IBitfinexBalanceSchema'



const log = debug('@alunajs:bitfinex/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IBitfinexBalanceSchema>> => {

  log('listing raw balances', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BitfinexHttp(settings) } = params

  const rawBalances = await http.authedRequest<IBitfinexBalanceSchema[]>({
    url: getBitfinexEndpoints(settings).balance.list,
    credentials,
  })

  const { requestWeight } = http

  return {
    rawBalances,
    requestWeight,
  }

}
