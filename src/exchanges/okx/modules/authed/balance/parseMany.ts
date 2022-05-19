import { debug } from 'debug'
import { reduce } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IOkxBalanceSchema } from '../../../schemas/IOkxBalanceSchema'



const log = debug('alunajs:okx/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IOkxBalanceSchema[]>,
): IAlunaBalanceParseManyReturns => {

  const { rawBalances } = params

  type TSrc = IOkxBalanceSchema
  type TAcc = IAlunaBalanceSchema[]

  const parsedBalances = reduce<TSrc, TAcc>(
    rawBalances,
    (accumulator, rawBalance) => {

      const {
        availBal,
        frozenBal,
      } = rawBalance

      const total = Number(availBal) + Number(frozenBal)

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
