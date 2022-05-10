import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { IBinanceBalanceSchema } from '../../../schemas/IBinanceBalanceSchema'



const log = debug('@alunajs:binance/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IBinanceBalanceSchema>> => {

  log('listing raw balances', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BinanceHttp(settings) } = params

  // TODO: Implement balance 'listRaw'
  const rawBalances = await http.authedRequest<IBinanceBalanceSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBinanceEndpoints(settings).balance.list,
    credentials,
  })

  const { requestCount } = http

  return {
    rawBalances,
    requestCount,
  }

}
