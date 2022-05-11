import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IBitmexOrderSchema } from '../../../schemas/IBitmexOrderSchema'



// const log = debug('@alunajs:bitmex/order/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IBitmexOrderSchema>,
): IAlunaOrderParseReturns => {

  // log('parse order', params)

  const { rawOrder } = params

  // TODO: Implement proper parser
  return rawOrder as any

}
