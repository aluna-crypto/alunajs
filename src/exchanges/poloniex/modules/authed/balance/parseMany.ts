import { debug } from 'debug'
import {
  forOwn,
  map,
} from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import {
  IPoloniexBalanceResponseSchema,
  IPoloniexBalanceSchema,
} from '../../../schemas/IPoloniexBalanceSchema'



const log = debug('@alunajs:poloniex/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IPoloniexBalanceResponseSchema>,
): IAlunaBalanceParseManyReturns => {

  const {
    rawBalances: rawBalancesResponse,
  } = params

  const rawBalances: IPoloniexBalanceSchema[] = []


  forOwn(rawBalancesResponse, (value, key) => {

    rawBalances.push({
      currency: key,
      ...value,
    })

  })

  const parsedBalances = map(rawBalances, (rawBalance) => {

    const { balance } = exchange.balance.parse({ rawBalance })

    return balance

  })

  log(`parsed ${parsedBalances.length} balances`)

  return { balances: parsedBalances }

}
