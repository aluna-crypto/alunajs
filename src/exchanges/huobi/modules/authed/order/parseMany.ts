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
import {
  IHuobiOrderResponseSchema,
  IHuobiOrdersResponseSchema,
} from '../../../schemas/IHuobiOrderSchema'
import { IHuobiSymbolSchema } from '../../../schemas/IHuobiSymbolSchema'



const log = debug('alunajs:huobi/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<IHuobiOrdersResponseSchema>,
): IAlunaOrderParseManyReturns => {

  const { rawOrders } = params

  const {
    huobiOrders,
    rawSymbols,
  } = rawOrders

  const pairSymbolsDictionary: { [key:string]: IHuobiSymbolSchema } = {}

  forEach(rawSymbols, (pair) => {

    const { symbol } = pair

    pairSymbolsDictionary[symbol] = pair

  })

  const parsedOrders = map(huobiOrders, (huobiOrder) => {

    const { symbol } = huobiOrder

    const rawSymbol = pairSymbolsDictionary[symbol]

    const rawOrder: IHuobiOrderResponseSchema = {
      huobiOrder,
      rawSymbol,
    }

    const { order } = exchange.order.parse({
      rawOrder,
    })

    return order

  })

  log(`parsed ${parsedOrders.length} orders`)

  return { orders: parsedOrders }

}
