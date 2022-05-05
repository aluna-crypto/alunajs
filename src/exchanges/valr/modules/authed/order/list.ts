import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderListParams,
  IAlunaOrderListReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ValrHttp } from '../../../ValrHttp'



const log = debug('@alunajs:valr/order/list')



export const list = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListReturns> => {

  log('params', params)

  const { http = new ValrHttp() } = params

  const { rawOrders } = await exchange.order.listRaw({ http })

  const { orders } = exchange.order.parseMany({ rawOrders })

  const { requestCount } = http

  return {
    orders,
    requestCount,
  }

}
