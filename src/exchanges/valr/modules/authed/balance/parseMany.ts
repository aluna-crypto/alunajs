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

  log(params, 'params')

  const { rawBalances } = params

  const parsedBalances = map(rawBalances, (rawBalance) => {

    const { balance } = exchange.balance.parse({ rawBalance })

    return balance

  })

  return { balances: parsedBalances }

}
