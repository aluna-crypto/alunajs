import { debug } from 'debug'
import { map } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { ISampleBalanceSchema } from '../../../schemas/ISampleBalanceSchema'



const log = debug('@alunajs:sample/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<ISampleBalanceSchema>,
): IAlunaBalanceParseManyReturns => {

  log(params, 'params')

  const { rawBalances } = params

  // TODO: Review map implementation
  const parsedBalances = map(rawBalances, (rawBalance) => {

    const { balance } = exchange.balance.parse({ rawBalance })

    return balance

  })

  return { balances: parsedBalances }

}
