import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseManyParams,
  IAlunaOrderParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IFtxOrderSchema } from '../../../schemas/IFtxOrderSchema'



const log = debug('@alunajs:ftx/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<IFtxOrderSchema[]>,
): IAlunaOrderParseManyReturns => {

  const { rawOrders } = params

  const parsedOrders = rawOrders.map((rawOrder) => {

    const { order } = exchange.order.parse({ rawOrder })

    return order

  })

  log(`parsed ${parsedOrders.length} orders`)

  return { orders: parsedOrders }

}
