import { debug } from 'debug'
import { reduce } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IGateBalanceSchema } from '../../../schemas/IGateBalanceSchema'



const log = debug('@alunajs:gate/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IGateBalanceSchema>,
): IAlunaBalanceParseManyReturns => {

  const { rawBalances } = params

  type TSrc = IGateBalanceSchema
  type TAcc = IAlunaBalanceSchema[]

  const parsedBalances = reduce<TSrc, TAcc>(rawBalances,
    (accumulator, rawBalance) => {

      const {
        available,
        locked,
      } = rawBalance

      const total = parseFloat(available) + parseFloat(locked)

      if (total > 0) {

        const { balance } = exchange.balance.parse({ rawBalance })

        accumulator.push(balance)

      }

      return accumulator

    }, [])

  log(`parsed ${parsedBalances.length} balances`)

  return { balances: parsedBalances }

}
