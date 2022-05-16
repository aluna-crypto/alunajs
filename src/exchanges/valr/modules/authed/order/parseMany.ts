import { debug } from 'debug'
import { keyBy } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseManyParams,
  IAlunaOrderParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import {
  IValrOrderListResponseSchema,
  IValrOrderSchema,
} from '../../../schemas/IValrOrderSchema'



const log = debug('alunajs:valr/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<IValrOrderListResponseSchema>,
): IAlunaOrderParseManyReturns => {

  const { rawOrders } = params

  const {
    orders,
    pairs,
  } = rawOrders

  const pairsDict = keyBy(pairs, 'symbol')

  const parsedOrders = orders.map((rawOrder) => {

    const pair = pairsDict[rawOrder.currencyPair]

    const rawOrderParseRequest: IValrOrderSchema = {
      order: rawOrder,
      pair,
    }

    const { order } = exchange.order.parse({ rawOrder: rawOrderParseRequest })

    return order

  })

  log(`parsed ${parsedOrders.length} orders`)

  return { orders: parsedOrders }

}
