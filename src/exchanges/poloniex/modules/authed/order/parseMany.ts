import { debug } from 'debug'
import { forOwn } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseManyParams,
  IAlunaOrderParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import {
  IPoloniexOrderResponseSchema,
  IPoloniexOrderSchema,
} from '../../../schemas/IPoloniexOrderSchema'



const log = debug('@alunajs:poloniex/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<IPoloniexOrderResponseSchema>,
): IAlunaOrderParseManyReturns => {

  const { rawOrders: rawOrdersResponse } = params

  const rawOrders: IPoloniexOrderSchema[] = []

  forOwn(rawOrdersResponse, (value, key) => {

    const splittedCurrencyPair = key.split('_')

    const baseCurrency = splittedCurrencyPair[0]
    const quoteCurrency = splittedCurrencyPair[1]

    const rawNestedOrders = value.map((order) => {

      return {
        ...order,
        currencyPair: key,
        baseCurrency,
        quoteCurrency,
      }

    })

    rawOrders.push(...rawNestedOrders)

  })

  const parsedOrders = rawOrders.map((rawOrder) => {

    const { order } = exchange.order.parse({ rawOrder })

    return order

  })

  log(`parsed ${parsedOrders.length} orders`)

  return { orders: parsedOrders }

}
