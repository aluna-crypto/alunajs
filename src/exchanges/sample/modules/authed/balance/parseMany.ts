import { debug } from 'debug'
import { reduce } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { ISampleBalanceSchema } from '../../../schemas/ISampleBalanceSchema'
import { parse } from './parse'



const log = debug('@aluna.js:sample/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<ISampleBalanceSchema>,
): IAlunaBalanceParseManyReturns => {

  const { rawBalances } = params

  type TSrc = ISampleBalanceSchema
  type TAcc = IAlunaBalanceSchema[]

  const parsedBalances = reduce<TSrc, TAcc>(rawBalances, (acc, out) => {

    const {
      total: totalBalance,
    } = out

    const total = Number(totalBalance)

    if (total > 0) {

      const {
        balance: parsedBalance,
      } = parse(exchange)(({ rawBalance: out }))

      acc.push(parsedBalance)

    }

    return acc

  }, [])

  log(`parsed ${parsedBalances.length} Sample balances`)

  return { balances: parsedBalances }

}
