import {
  each,
  entries,
} from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import {
  IAlunaBalanceGetTradableBalanceParams,
  IAlunaBalanceModule,
} from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { BitfinexAccountsAdapter } from '../enums/adapters/BitfinexAccountsAdapter'
import { BitfinexAccountsEnum } from '../enums/BitfinexAccountsEnum'
import { IBitfinexBalanceSchema } from '../schemas/IBitfinexBalanceSchema'
import { BitfinexBalanceParser } from '../schemas/parsers/BitfnexBalanceParser'



export class BitfinexBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IBitfinexBalanceSchema[]> {

    BitfinexLog.info('fetching Bitfinex balances')

    const { privateRequest } = BitfinexHttp

    const rawBalances = await privateRequest<IBitfinexBalanceSchema[]>({
      url: 'https://api.bitfinex.com/v2/auth/r/wallets',
      keySecret: this.exchange.keySecret,
    })

    return rawBalances

  }

  public async list (): Promise<IAlunaBalanceSchema[]> {

    const rawBalances = await this.listRaw()

    const parsedBalances = this.parseMany({ rawBalances })

    BitfinexLog.info(`parsed ${parsedBalances.length} balances for Bitfinex`)

    return parsedBalances

  }

  public parse (params: {
    rawBalance: IBitfinexBalanceSchema,
  }): IAlunaBalanceSchema {

    const { rawBalance } = params

    const parsedBalance = BitfinexBalanceParser.parse({
      rawBalance,
    })

    return parsedBalance

  }

  public parseMany (params: {
    rawBalances: IBitfinexBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    const { rawBalances } = params

    const parsedBalances = rawBalances.reduce((accumulator, rawBalance) => {

      const [walletType] = rawBalance

      // skipping 'lending' balances types for now
      if (walletType === BitfinexAccountsEnum.FUNDING) {

        return accumulator

      }

      const parsedBalance = this.parse({ rawBalance })

      accumulator.push(parsedBalance)

      return accumulator

    }, [] as IAlunaBalanceSchema[])

    BitfinexLog.info(`parsed ${parsedBalances.length} Bitfinex balances`)

    return parsedBalances

  }

  public async getTradableBalance (
    params: IAlunaBalanceGetTradableBalanceParams,
  ): Promise<number> {

    const {
      rate,
      side,
      account,
      symbolPair,
    } = params

    const requiredParams = {
      rate,
      side,
      account,
    }

    each(entries(requiredParams), ([paramName, paramValue]) => {

      if (!paramValue) {

        throw new AlunaError({
          httpStatusCode: 422,
          message: `'${paramName}' param is required to get Bitfinex tradable balance`,
          code: AlunaGenericErrorCodes.PARAM_ERROR,
        })

      }

    })

    const translatedAccount = BitfinexAccountsAdapter.translateToBitfinex({
      from: account!,
    })

    BitfinexLog.info(`fetching Bitfinex tradable balance for ${symbolPair}`)

    const { privateRequest } = BitfinexHttp

    const dir = side === AlunaOrderSideEnum.BUY
      ? 1
      : -1

    const [tradableBalance] = await privateRequest<[number]>({
      url: 'https://api.bitfinex.com/v2/auth/calc/order/avail',
      keySecret: this.exchange.keySecret,
      body: {
        dir,
        symbol: symbolPair,
        rate: rate!.toString(),
        type: translatedAccount,
      },
    })

    return tradableBalance

  }

}
