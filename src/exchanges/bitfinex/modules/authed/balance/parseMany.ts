import { debug } from 'debug'
import { reduce } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { BitfinexAccountsEnum } from '../../../enums/BitfinexAccountsEnum'
import { IBitfinexBalanceSchema } from '../../../schemas/IBitfinexBalanceSchema'



const log = debug('alunajs:bitfinex/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IBitfinexBalanceSchema[]>,
): IAlunaBalanceParseManyReturns => {

  const { rawBalances } = params


  type TSrc = IBitfinexBalanceSchema
  type TAcc = IAlunaBalanceSchema[]

  const balances = reduce<TSrc, TAcc>(rawBalances, (acc, rawBalance) => {

    const [walletType] = rawBalance

    // skipping 'lending' balances types for now
    if (walletType === BitfinexAccountsEnum.FUNDING) {

      return acc

    }

    const { balance } = exchange.balance.parse({ rawBalance })

    acc.push(balance)

    return acc

  }, [])


  log(`parsed ${balances.length} balances`)

  return { balances }

}
