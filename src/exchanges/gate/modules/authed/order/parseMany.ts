import { debug } from 'debug'
import { reduce } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseManyParams,
  IAlunaOrderParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IGateOrderListResponseSchema, IGateOrderSchema } from '../../../schemas/IGateOrderSchema'



const log = debug('@alunajs:gate/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<IGateOrderListResponseSchema[]>,
): IAlunaOrderParseManyReturns => {

  const { rawOrders } = params

  type TSrc = IGateOrderListResponseSchema
  type TAcc = IGateOrderSchema[]

  const detachedRawOrders = reduce<TSrc, TAcc>(rawOrders, (acc, curr) => {

    acc.push(...curr.orders)

    return acc

  }, [])

  const parsedOrders = detachedRawOrders.map((rawOrder) => {

    const { order } = exchange.order.parse({ rawOrder })

    return order

  })

  log(`parsed ${parsedOrders.length} orders`)

  return { orders: parsedOrders }

}
