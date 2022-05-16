import { debug } from 'debug'
import {
  forOwn,
  reduce,
} from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
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

  type TSrc = IPoloniexBalanceSchema
  type TAcc = IAlunaBalanceSchema[]

  const parsedBalances = reduce<TSrc, TAcc>(
    rawBalances,
    (accumulator, rawBalance) => {

      const {
        available,
        onOrders,
      } = rawBalance

      const total = Number(available) + Number(onOrders)

      if (total > 0) {
        const { balance } = exchange.balance.parse({ rawBalance })

        accumulator.push(balance)
      }

      return accumulator
    }, [],
  )

  log(`parsed ${parsedBalances.length} balances`)

  return { balances: parsedBalances }

}
