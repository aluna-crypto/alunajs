import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderListParams,
  IAlunaOrderListReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BittrexHttp } from '../../../BittrexHttp'



const log = debug('@alunajs:bittrex/order/list')



export const list = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListReturns> => {

  log('listing orders', params)

  const { http = new BittrexHttp() } = params

  const { rawOrders } = await exchange.order.listRaw({ http })

  const { orders } = exchange.order.parseMany({ rawOrders })

  const { requestCount } = http

  return {
    orders,
    requestCount,
  }

}
