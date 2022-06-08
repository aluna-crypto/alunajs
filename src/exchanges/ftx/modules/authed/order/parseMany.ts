import { debug } from 'debug'
import { reduce } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseManyParams,
  IAlunaOrderParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import {
  IFtxOrderSchema,
  IFtxTriggerOrderSchema,
} from '../../../schemas/IFtxOrderSchema'



const log = debug('alunajs:ftx/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseManyParams<Array<IFtxTriggerOrderSchema | IFtxOrderSchema>>,
): IAlunaOrderParseManyReturns => {

  const { rawOrders } = params

  const orders = reduce(rawOrders, (acc, rawOrder) => {

    const {
      type,
      orderType,
    } = rawOrder as IFtxTriggerOrderSchema

    // Skipping unsupported trigger order types
    if (orderType && !/stop/.test(type)) {

      return acc

    }

    const { order } = exchange.order.parse({ rawOrder })

    acc.push(order)

    return acc

  }, [] as IAlunaOrderSchema[])

  log(`parsed ${orders.length} orders`)

  return { orders }

}
