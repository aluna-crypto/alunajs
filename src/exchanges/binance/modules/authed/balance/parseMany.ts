import { debug } from 'debug'
import {
  concat,
  reduce,
} from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import {
  IBinanceBalancesSchema,
  IBinanceMarginBalanceSchema,
  IBinanceSpotBalanceSchema,
} from '../../../schemas/IBinanceBalanceSchema'



const log = debug('@alunajs:binance/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IBinanceBalancesSchema>,
): IAlunaBalanceParseManyReturns => {

  const { rawBalances } = params

  const {
    spotBalances,
    marginBalances,
  } = rawBalances

  const binanceBalances = concat(spotBalances, marginBalances)

  type TS = IBinanceSpotBalanceSchema | IBinanceMarginBalanceSchema
  type TAcc = IAlunaBalanceSchema[]

  const balances = reduce<TS, TAcc>(binanceBalances, (acc, rawBalance) => {

    const {
      free,
      locked,
    } = rawBalance

    let total: number

    const marginTotal = (rawBalance as IBinanceMarginBalanceSchema).netAsset

    if (marginTotal) {

      total = Number(marginTotal)

    } else {

      total = Number(free) + Number(locked)

    }

    if (total > 0) {

      const { balance } = exchange.balance.parse({ rawBalance })

      acc.push(balance)

    }


    return acc

  }, [])

  log(`parsed ${balances.length} balances`)

  return { balances }

}
