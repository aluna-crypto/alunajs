import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IGateBalanceSchema } from '../../../schemas/IGateBalanceSchema'



const log = debug('@alunajs:exchanges/gate/balance/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IGateBalanceSchema>,
): IAlunaBalanceParseReturns => {

  log(params, 'params')

  // TODO: Implement balance parse
  const balance: IAlunaBalanceSchema = {} as any

  return { balance }

}
