import { debug } from 'debug'
import {
  keyBy,
  map,
} from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import {
  IBitmexBalanceSchema,
  IBitmexBalancesSchema,
} from '../../../schemas/IBitmexBalanceSchema'



const log = debug('alunajs:bitmex/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IBitmexBalancesSchema>,
): IAlunaBalanceParseManyReturns => {

  const { rawBalances } = params

  const {
    assets,
    assetsDetails,
  } = rawBalances

  const assetsDetailsDict = keyBy(assetsDetails, 'currency')

  const balances = map(assets, (asset) => {

    const { currency } = asset

    const rawBalance: IBitmexBalanceSchema = {
      asset,
      assetDetails: assetsDetailsDict[currency],
    }

    const { balance } = exchange.balance.parse({ rawBalance })

    return balance

  })

  log(`parsed ${balances.length} balances`)

  return { balances }

}
