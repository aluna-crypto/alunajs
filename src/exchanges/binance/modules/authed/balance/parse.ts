import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IBinanceBalanceSchema } from '../../../schemas/IBinanceBalanceSchema'



// const log = debug('@alunajs:exchanges/binance/balance/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IBinanceBalanceSchema>,
): IAlunaBalanceParseReturns => {

  // log('parse balance', params)

  // TODO: Implement balance parse
  const balance: IAlunaBalanceSchema = params as any

  return { balance }

}
