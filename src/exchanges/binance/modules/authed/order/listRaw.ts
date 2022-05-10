import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { binanceHttp } from '../../../binanceHttp'
import { getbinanceEndpoints } from '../../../binanceSpecs'
import { IbinanceOrderSchema } from '../../../schemas/IbinanceOrderSchema'



const log = debug('@alunajs:binance/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IbinanceOrderSchema[]>> => {

  log('fetching binance open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new binanceHttp(settings) } = params

  // TODO: Implement proper request
  const rawOrders = await http.authedRequest<IbinanceOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getbinanceEndpoints(settings).order.list,
    credentials,
  })

  const { requestCount } = http

  return {
    rawOrders,
    requestCount,
  }

}
