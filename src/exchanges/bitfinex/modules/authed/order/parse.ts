import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'



const log = debug('@alunajs:bitfinex/order/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams,
): IAlunaOrderParseReturns => {

  log('params', params)

  const { rawOrder } = params

  // TODO: Implement proper parser
  const parsedOrder: IAlunaOrderSchema = rawOrder as any

  return { order: parsedOrder }

}
