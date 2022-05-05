import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { IBitfinexBalanceSchema } from '../../../schemas/IBitfinexBalanceSchema'



const log = debug('@alunajs:bitfinex/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IBitfinexBalanceSchema>> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new BitfinexHttp() } = params

  // TODO: Implement balance 'listRaw'
  const rawBalances = await http.authedRequest<IBitfinexBalanceSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: bitfinexEndpoints.balance.list,
    credentials,
  })

  const { requestCount } = http

  return {
    rawBalances,
    requestCount,
  }

}
