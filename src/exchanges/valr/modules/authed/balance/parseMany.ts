import { debug } from 'debug'
import { reduce } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IValrBalanceSchema } from '../../../schemas/IValrBalanceSchema'



const log = debug('alunajs:valr/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IValrBalanceSchema[]>,
): IAlunaBalanceParseManyReturns => {

  const { rawBalances } = params

  type TAcc = IAlunaBalanceSchema[]
  type TSrc = IValrBalanceSchema

  const parsedBalances = reduce<TSrc, TAcc>(rawBalances, (acc, rawBalance) => {

    const { total } = rawBalance

    if (Number(total) > 0) {

      const { balance } = exchange.balance.parse({ rawBalance })

      acc.push(balance)

    }

    return acc

  }, [])

  log(`parsed ${parsedBalances.length} balances`)

  return { balances: parsedBalances }

}
