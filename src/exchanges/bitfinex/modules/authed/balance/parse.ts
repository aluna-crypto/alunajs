import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { translateWalletToAluna } from '../../../enums/adapters/bitfinexWalletAdapter'
import { IBitfinexBalanceSchema } from '../../../schemas/IBitfinexBalanceSchema'



const log = debug('alunajs:exchanges/bitfinex/balance/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IBitfinexBalanceSchema>,
): IAlunaBalanceParseReturns => {

  log('list balances', params)

  const { rawBalance } = params

  const [
    walletType,
    currency,
    balance,
    _unsettledInterest,
    availableBalance,
  ] = rawBalance

  const wallet = translateWalletToAluna({
    from: walletType,
  })

  const symbolId = translateSymbolId({
    exchangeSymbolId: currency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const parsedBalance: IAlunaBalanceSchema = {
    symbolId,
    available: availableBalance,
    wallet,
    total: balance,
    meta: rawBalance,
  }

  return { balance: parsedBalance }

}
