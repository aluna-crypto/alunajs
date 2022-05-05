import { debug } from 'debug'
import { map } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IBitfinexBalanceSchema } from '../../../schemas/IBitfinexBalanceSchema'



const log = debug('@alunajs:bitfinex/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IBitfinexBalanceSchema>,
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
