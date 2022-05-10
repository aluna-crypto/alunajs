import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { IBinanceOrderSchema } from '../../../schemas/IBinanceOrderSchema'



const log = debug('@alunajs:binance/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IBinanceOrderSchema[]>> => {

  log('fetching Binance open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BinanceHttp(settings) } = params

  // TODO: Implement proper request
  const rawOrders = await http.authedRequest<IBinanceOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBinanceEndpoints(settings).order.list,
    credentials,
  })

  const { requestCount } = http

  return {
    rawOrders,
    requestCount,
  }

}
