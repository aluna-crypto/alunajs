import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IFtxBalanceSchema } from '../../../schemas/IFtxBalanceSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IFtxBalanceSchema>,
): IAlunaBalanceParseReturns => {


  // TODO: Implement balance parse
  const balance: IAlunaBalanceSchema = params as any

  return { balance }

}
