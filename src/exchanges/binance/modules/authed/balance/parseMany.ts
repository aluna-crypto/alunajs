import { debug } from 'debug'
import { reduce } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IBinanceBalanceSchema } from '../../../schemas/IBinanceBalanceSchema'



const log = debug('@alunajs:binance/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IBinanceBalanceSchema[]>,
): IAlunaBalanceParseManyReturns => {

  const { rawBalances } = params


  type TSrc = IBinanceBalanceSchema
  type TAcc = IAlunaBalanceSchema[]

  const parsedBalances = reduce<TSrc, TAcc>(
    rawBalances, (accumulator, rawBalance) => {

      const {
        free,
        locked,
      } = rawBalance

      const total = parseFloat(free) + parseFloat(locked)

      if (total > 0) {

        const { balance } = exchange.balance.parse({ rawBalance })

        accumulator.push(balance)

      }


      return accumulator

    },
    [],
  )

  log(`parsed ${parsedBalances.length} balances`)

  return { balances: parsedBalances }

}
