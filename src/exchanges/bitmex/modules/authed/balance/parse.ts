import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IBitmexBalanceSchema } from '../../../schemas/IBitmexBalanceSchema'



// const log = debug('@alunajs:exchanges/bitmex/balance/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IBitmexBalanceSchema>,
): IAlunaBalanceParseReturns => {

  // log('parse balance', params)

  // TODO: Implement balance parse
  const balance: IAlunaBalanceSchema = params as any

  return { balance }

}
