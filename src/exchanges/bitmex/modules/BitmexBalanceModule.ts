import BigNumber from 'bignumber.js'
import {
  filter,
  map,
} from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import {
  IAlunaBalanceGetTradableBalanceParams,
  IAlunaBalanceModule,
} from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { BitmexSettlementCurrencyEnum } from '../enums/BitmexSettlementCurrencyEnum'
import { IBitmexBalanceSchema } from '../schemas/IBitmexBalanceSchema'
import { BitmexBalanceParser } from '../schemas/parsers/BitmexBalanceParser'
import { BitmexMarketModule } from './BitmexMarketModule'



export class BitmexBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IBitmexBalanceSchema[]> {

    BitmexLog.info('fetching BitMEX balances')

    const { privateRequest } = BitmexHttp

    const rawBalances = await privateRequest<IBitmexBalanceSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITMEX_URL}/user/margin`,
      body: { currency: 'all' },
      keySecret: this.exchange.keySecret,
    })

    return rawBalances

  }

  public async list (): Promise<IAlunaBalanceSchema[]> {

    const rawBalances = await this.listRaw()

    const parsedBalances = this.parseMany({ rawBalances })

    return parsedBalances

  }

  public parse (params: {
    rawBalance: IBitmexBalanceSchema,
  }): IAlunaBalanceSchema {

    const { rawBalance } = params

    const parsedBalance = BitmexBalanceParser.parse({
      rawBalance,
    })

    return parsedBalance

  }

  public parseMany (params: {
    rawBalances: IBitmexBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    const { rawBalances } = params

    const parsedBalances = map(rawBalances, (rawBalance) => {

      const parsedBalance = this.parse({
        rawBalance,
      })

      return parsedBalance

    })

    BitmexLog.info(`parsed ${parsedBalances.length} balances for BitMEX`)

    return parsedBalances

  }

  public async getTradableBalance (
    params: IAlunaBalanceGetTradableBalanceParams,
  ): Promise<number> {

    const { symbolPair } = params

    BitmexLog.info(`fetching Bitmex tradable balance for ${symbolPair}`)

    const { settlCurrency } = await BitmexMarketModule.getRaw({
      symbolPair,
    })

    const balances = await this.list()

    // TODO: refact after implementing mappings
    const desiredAsset = filter(balances, ({ symbolId }) => {

      if (settlCurrency === BitmexSettlementCurrencyEnum.BTC) {

        return symbolId === 'BTC'

      }

      return symbolId === 'USDT'

    })

    if (!desiredAsset.length) {

      const alunaError = new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: `No available balance found for asset: ${symbolPair}`,
      })

      BitmexLog.error(alunaError)

      throw alunaError

    }

    const { available } = desiredAsset[0]

    const leverage = await this.exchange.position!.getLeverage!({
      symbolPair,
    })

    const computedLeverage = leverage === 0
      ? 1
      : leverage

    const tradableBalance = new BigNumber(available)
      .times(computedLeverage)
      .toNumber()

    return tradableBalance

  }

}
