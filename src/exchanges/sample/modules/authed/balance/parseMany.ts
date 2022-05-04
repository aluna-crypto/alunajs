import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { ISampleBalanceSchema } from '../../../schemas/ISampleBalanceSchema'



const log = debug('@aluna.js:sample/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<ISampleBalanceSchema>,
): IAlunaBalanceParseManyReturns => {

  log(params, 'params')

  // TODO: Implement balance 'parseMany'
  const parsedBalances: IAlunaBalanceSchema[] = []

  return { balances: parsedBalances }

}
