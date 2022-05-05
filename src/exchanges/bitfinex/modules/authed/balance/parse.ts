import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IBitfinexBalanceSchema } from '../../../schemas/IBitfinexBalanceSchema'



const log = debug('@alunajs:exchanges/bitfinex/balance/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IBitfinexBalanceSchema>,
): IAlunaBalanceParseReturns => {

  log(params, 'params')

  // TODO: Implement balance parse
  const balance: IAlunaBalanceSchema = {} as any

  return { balance }

}
