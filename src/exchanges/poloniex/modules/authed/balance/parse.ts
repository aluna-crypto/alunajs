import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IPoloniexBalanceSchema } from '../../../schemas/IPoloniexBalanceSchema'



// const log = debug('@alunajs:exchanges/poloniex/balance/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IPoloniexBalanceSchema>,
): IAlunaBalanceParseReturns => {

  // log('parse balance', params)

  // TODO: Implement balance parse
  const balance: IAlunaBalanceSchema = params as any

  return { balance }

}
