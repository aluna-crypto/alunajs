import { IAlunaBalanceSchema } from '../../../../lib/schemas/IAlunaBalanceSchema'
import { BitfinexAccountsAdapter } from '../../enums/adapters/BitfinexAccountsAdapter'
import { IBitfinexBalanceSchema } from '../IBitfinexBalanceSchema'



export class BitfinexBalanceParser {

  static parse (params: {
    rawBalance: IBitfinexBalanceSchema,
    customCurrency?: string,
  }) {

    const {
      rawBalance,
      customCurrency,
    } = params

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

    const parsedBalance: IAlunaBalanceSchema = {
      account,
      symbolId: customCurrency || currency,
      available: availableBalance,
      total: balance,
      meta: rawBalance,
    }

    return parsedBalance

  }

}
