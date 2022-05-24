import { debug } from 'debug'
import { forEach, map } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseManyParams,
  IAlunaOrderParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IHuobiOrderResponseSchema, IHuobiOrdersResponseSchema } from '../../../schemas/IHuobiOrderSchema'
import { IHuobiSymbolSchema } from '../../../schemas/IHuobiSymbolSchema'



const log = debug('alunajs:huobi/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<IHuobiOrdersResponseSchema>,
): IAlunaOrderParseManyReturns => {

  const { rawOrders: rawOrdersRequest } = params

  const {
    rawOrders,
    rawSymbols,
  } = rawOrdersRequest

  const pairSymbolsDictionary: { [key:string]: IHuobiSymbolSchema } = {}

  forEach(rawSymbols, (pair) => {

    const { symbol } = pair

    pairSymbolsDictionary[symbol] = pair

  })

  const parsedOrders = map(rawOrders, (rawOrder) => {

    const { symbol } = rawOrder

    const rawSymbol = pairSymbolsDictionary[symbol]

    const rawOrderRequest: IHuobiOrderResponseSchema = {
      rawOrder,
      rawSymbol,
    }

    const { order } = exchange.order.parse({
      rawOrder: rawOrderRequest,
    })

    return order

  })

  log(`parsed ${parsedOrders.length} orders`)

  return { orders: parsedOrders }

}
