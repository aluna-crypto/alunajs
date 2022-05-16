import { debug } from 'debug'
import {
  forEach,
  map,
} from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseManyParams,
  IAlunaOrderParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IBinanceOrdersResponseSchema } from '../../../schemas/IBinanceOrderSchema'
import { IBinanceSymbolSchema } from '../../../schemas/IBinanceSymbolSchema'



const log = debug('alunajs:binance/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<IBinanceOrdersResponseSchema>,
): IAlunaOrderParseManyReturns => {

  const {
    rawOrders: rawOrdersRequest,
  } = params

  const {
    rawOrders,
    rawSymbols,
  } = rawOrdersRequest

  const pairSymbolsDictionary: { [key:string]: IBinanceSymbolSchema } = {}

  forEach(rawSymbols, (pair) => {

    const { symbol } = pair

    pairSymbolsDictionary[symbol] = pair

  })

  const parsedOrders = map(rawOrders, (rawOrder) => {

    const {
      symbol,
    } = rawOrder

    const rawSymbol = pairSymbolsDictionary[symbol]

    const rawOrderRequest = {
      rawOrder,
      rawSymbol,
    }

    const { order } = exchange.order.parse({ rawOrder: rawOrderRequest })

    return order

  })

  log(`parsed ${parsedOrders.length} orders`)

  return { orders: parsedOrders }

}
