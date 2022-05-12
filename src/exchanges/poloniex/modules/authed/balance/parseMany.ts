import { debug } from 'debug'
import { map } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IPoloniexBalanceSchema } from '../../../schemas/IPoloniexBalanceSchema'



const log = debug('@alunajs:poloniex/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IPoloniexBalanceSchema[]>,
): IAlunaBalanceParseManyReturns => {

  const { rawBalances } = params

  // TODO: Review map implementation
  const parsedBalances = map(rawBalances, (rawBalance) => {

    const { balance } = exchange.balance.parse({ rawBalance })

    return balance

  })

  log(`parsed ${parsedBalances.length} balances`)

  return { balances: parsedBalances }

}
