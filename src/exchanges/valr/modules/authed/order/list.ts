import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderListParams,
  IAlunaOrderListReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ValrHttp } from '../../../ValrHttp'



const log = debug('alunajs:valr/order/list')



export const list = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListReturns> => {

  log('listing orders', params)

  const { http = new ValrHttp(exchange.settings) } = params

  const { rawOrders } = await exchange.order.listRaw({ http })

  const { orders } = exchange.order.parseMany({ rawOrders })

  const { requestWeight } = http

  return {
    orders,
    requestWeight,
  }

}
