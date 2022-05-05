import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IValrBalanceSchema } from '../../../schemas/IValrBalanceSchema'



const log = debug('@alunajs:exchanges/valr/balance/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IValrBalanceSchema>,
): IAlunaBalanceParseReturns => {

  log(params, 'params')

  // TODO: Implement balance parse
  const balance: IAlunaBalanceSchema = {} as any

  return { balance }

}