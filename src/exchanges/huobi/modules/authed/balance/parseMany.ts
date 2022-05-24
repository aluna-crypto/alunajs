import { debug } from 'debug'
import { reduce } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IHuobiBalanceSchema } from '../../../schemas/IHuobiBalanceSchema'



const log = debug('alunajs:huobi/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IHuobiBalanceSchema[]>,
): IAlunaBalanceParseManyReturns => {

  const { rawBalances } = params

  type TSrc = IHuobiBalanceSchema
  type TAcc = IAlunaBalanceSchema[]

  const parsedBalances = reduce<TSrc, TAcc>(
    rawBalances,
    (accumulator, rawBalance) => {

      const { balance: currencyBalance } = rawBalance

      const total = Number(currencyBalance)

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
