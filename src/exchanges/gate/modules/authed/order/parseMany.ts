import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseManyParams,
  IAlunaOrderParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IGateOrderSchema } from '../../../schemas/IGateOrderSchema'



const log = debug('@alunajs:gate/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<IGateOrderSchema[]>,
): IAlunaOrderParseManyReturns => {

  log('params', params)

  const { rawOrders } = params

  const parsedOrders = rawOrders.map((rawOrder) => {

    const { order } = exchange.order.parse({ rawOrder })

    return order

  })

  log(`parsed ${parsedOrders.length} orders for Gate`)

  return { orders: parsedOrders }

}
