import { debug } from 'debug'
import { reduce } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IFtxBalanceSchema } from '../../../schemas/IFtxBalanceSchema'



const log = debug('@alunajs:ftx/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IFtxBalanceSchema[]>,
): IAlunaBalanceParseManyReturns => {

  const { rawBalances } = params

  type TSrc = IFtxBalanceSchema
  type TAcc = IAlunaBalanceSchema[]


  const parsedBalances = reduce<TSrc, TAcc>(
    rawBalances,
    (accumulator, rawBalance) => {

      const { total } = rawBalance

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
