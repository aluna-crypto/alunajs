import { debug } from 'debug'
import {
  keyBy,
  reduce,
} from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseManyParams,
  IAlunaOrderParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import {
  IBinanceOrderResponseSchema,
  IBinanceOrderSchema,
  IBinanceOrdersResponseSchema,
} from '../../../schemas/IBinanceOrderSchema'



const log = debug('@alunajs:binance/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<IBinanceOrdersResponseSchema>,
): IAlunaOrderParseManyReturns => {

  const { rawOrders } = params

  const {
    rawSymbols,
    binanceOrders,
  } = rawOrders

  const symbolsDict = keyBy(rawSymbols, 'symbol')

  type TSrc = IBinanceOrderSchema
  type TAcc = IAlunaOrderSchema[]

  const orders = reduce<TSrc, TAcc>(binanceOrders, (acc, binanceOrder) => {

    const {
      symbol,
      isIsolated,
    } = binanceOrder

    // Skipping Isolated Margin Orders for now
    if (isIsolated) {

      return acc

    }

    const rawOrder: IBinanceOrderResponseSchema = {
      binanceOrder,
      rawSymbol: symbolsDict[symbol],
    }

    const { order } = exchange.order.parse({ rawOrder })

    acc.push(order)

    return acc

  }, [])

  log(`parsed ${orders.length} orders`)

  return { orders }

}
