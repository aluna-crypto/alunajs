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
  IBitmexOrder,
  IBitmexOrderSchema,
  IBitmexOrdersSchema,
} from '../../../schemas/IBitmexOrderSchema'



const log = debug('@alunajs:bitmex/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<IBitmexOrdersSchema>,
): IAlunaOrderParseManyReturns => {

  const {
    rawOrders: {
      bitmexOrders,
      markets,
    },
  } = params

  const marketsDict = keyBy(markets, 'symbolPair')

  type TSrc = IBitmexOrder
  type TAcc = IAlunaOrderSchema[]


  const orders = reduce<TSrc, TAcc>(bitmexOrders, (acc, src) => {

    const { symbol } = src

    const rawOrder: IBitmexOrderSchema = {
      bitmexOrder: src,
      market: marketsDict[symbol],
    }


    // Skipping spot orders for now
    if (/_/.test(symbol)) {

      return acc

    }

    const { order } = exchange.order.parse({ rawOrder })

    acc.push(order)

    return acc

  }, [])

  log(`parsed ${orders.length} orders`)

  return { orders }

}
