import { debug } from 'debug'
import {
  keyBy,
  reduce,
} from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import {
  IBitmexAsset,
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

  type TAcc = IAlunaBalanceSchema[]
  type TSrc = IBitmexAsset

  const balances = reduce<TSrc, TAcc>(assets, (acc, asset) => {

    const {
      currency,
      walletBalance,
    } = asset

    if (walletBalance > 0) {

      const rawBalance: IBitmexBalanceSchema = {
        asset,
        assetDetails: assetsDetailsDict[currency],
      }

      const { balance } = exchange.balance.parse({ rawBalance })

      acc.push(balance)

    }

    return acc

  }, [])

  log(`parsed ${balances.length} balances`)

  return { balances }

}
