import { IAlunaBalanceSchema } from '../../../..'
import { BitfinexAccountsAdapter } from '../../enums/adapters/BitfinexAccountsAdapter'
import { IBitfinexBalanceSchema } from '../IBitfinexBalanceSchema'



export class BitfinexBalanceParser {

  static parser (params: {
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
      from: walletType,
    })

    const parsedBalance: IAlunaBalanceSchema = {
      account,
      symbolId: currency,
      available: availableBalance,
      total: balance,
      meta: rawBalance,
    }

    return parsedBalance

  }

}
