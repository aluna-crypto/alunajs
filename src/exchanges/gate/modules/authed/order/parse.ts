import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { IGateOrderSchema } from '../../../schemas/IGateOrderSchema'



// const log = debug('@alunajs:gate/order/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IGateOrderSchema>,
): IAlunaOrderParseReturns => {

  // log('params', params)

  const { rawOrder } = params

  // TODO: Implement proper parser
  const parsedOrder: IAlunaOrderSchema = rawOrder as any

  return { order: parsedOrder }

}
