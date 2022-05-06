import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseManyParams,
  IAlunaOrderParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ISampleOrderSchema } from '../../../schemas/ISampleOrderSchema'



const log = debug('@alunajs:sample/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<ISampleOrderSchema[]>,
): IAlunaOrderParseManyReturns => {

  log('params', params)

  const { rawOrders } = params

  const parsedOrders = rawOrders.map((rawOrder) => {

    const { order } = exchange.order.parse({ rawOrder })

    return order

  })

  log(`parsed ${parsedOrders.length} orders for Sample`)

  return { orders: parsedOrders }

}
