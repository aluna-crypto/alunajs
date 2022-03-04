import { IAlunaBalanceSchema } from '../../../../lib/schemas/IAlunaBalanceSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Bitfinex } from '../../Bitfinex'
import { BitfinexAccountsAdapter } from '../../enums/adapters/BitfinexAccountsAdapter'
import { IBitfinexBalanceSchema } from '../IBitfinexBalanceSchema'



export class BitfinexBalanceParser {

  static parse (params: {
    rawBalance: IBitfinexBalanceSchema,
  }) {

    const { rawBalance } = params

    const [
      walletType,
      currency,
      balance,
      _unsettledInterest,
      availableBalance,
    ] = rawBalance

    const account = BitfinexAccountsAdapter.translateToAluna({
      value: walletType,
    })

    const symbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: currency,
      symbolMappings: Bitfinex.settings.mappings,
    })

    const parsedBalance: IAlunaBalanceSchema = {
      account,
      symbolId,
      available: availableBalance,
      total: balance,
      meta: rawBalance,
    }

    return parsedBalance

  }

}
