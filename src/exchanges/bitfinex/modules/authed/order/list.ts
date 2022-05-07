import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderListParams,
  IAlunaOrderListReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BitfinexHttp } from '../../../BitfinexHttp'



const log = debug('@alunajs:bitfinex/order/list')



export const list = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListReturns> => {

  log('listing orders', params)

  const { http = new BitfinexHttp() } = params

  const { rawOrders } = await exchange.order.listRaw({ http })

  const { orders } = exchange.order.parseMany({ rawOrders })

  const { requestCount } = http

  return {
    orders,
    requestCount,
  }

}
