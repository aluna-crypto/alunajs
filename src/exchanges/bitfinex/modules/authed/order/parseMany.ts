import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseManyParams,
  IAlunaOrderParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IBitfinexOrderSchema } from '../../../schemas/IBitfinexOrderSchema'



const log = debug('@alunajs:bitfinex/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<IBitfinexOrderSchema[]>,
): IAlunaOrderParseManyReturns => {

  log('params', params)

  const { rawOrders } = params

  const parsedOrders = rawOrders.map((rawOrder) => {

    const { order } = exchange.order.parse({ rawOrder })

    return order

  })

  log(`parsed ${parsedOrders.length} orders for Bitfinex`)

  return { orders: parsedOrders }

}
