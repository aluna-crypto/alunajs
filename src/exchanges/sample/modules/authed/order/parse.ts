import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { ISampleOrderSchema } from '../../../schemas/ISampleOrderSchema'



// const log = debug('@alunajs:sample/order/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<ISampleOrderSchema>,
): IAlunaOrderParseReturns => {

  // log('parse order', params)

  const { rawOrder } = params

  // TODO: Implement proper parser
  const parsedOrder: IAlunaOrderSchema = rawOrder as any

  return { order: parsedOrder }

}
