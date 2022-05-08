import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { ISampleBalanceSchema } from '../../../schemas/ISampleBalanceSchema'



// const log = debug('@alunajs:exchanges/sample/balance/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<ISampleBalanceSchema>,
): IAlunaBalanceParseReturns => {

  // log('parse balance', params)

  // TODO: Implement balance parse
  const balance: IAlunaBalanceSchema = params as any

  return { balance }

}
