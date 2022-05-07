import { debug } from 'debug'
import { map } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IValrBalanceSchema } from '../../../schemas/IValrBalanceSchema'



const log = debug('@alunajs:valr/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IValrBalanceSchema>,
): IAlunaBalanceParseManyReturns => {

  const { rawBalances } = params

  const parsedBalances = map(rawBalances, (rawBalance) => {

    const { balance } = exchange.balance.parse({ rawBalance })

    return balance

  })

  log(`parsed ${parsedBalances.length} balances`)

  return { balances: parsedBalances }

}
