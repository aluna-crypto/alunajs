import { debug } from 'debug'
import { reduce } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseManyParams,
  IAlunaOrderParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { IBitfinexOrderSchema } from '../../../schemas/IBitfinexOrderSchema'



const log = debug('@alunajs:bitfinex/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<IBitfinexOrderSchema>,
): IAlunaOrderParseManyReturns => {

  log('params', params)

  const { rawOrders } = params

  type TAcc = IBitfinexOrderSchema
  type TSrc = IAlunaOrderSchema[]

  const parsedOrders = reduce<TAcc, TSrc>(rawOrders, (acc, src) => {

    const [
      _id,
      _gid,
      _cid,
      symbol,
    ] = src

    // skipping 'funding' and 'derivatives' orders for now
    if (/f|F0/.test(symbol)) {

      return acc

    }

    const { order } = exchange.order.parse({ rawOrder: src })

    acc.push(order)

    return acc

  }, [])

  log(`parsed ${parsedOrders.length} orders for Bitfinex`)

  return { orders: parsedOrders }

}
