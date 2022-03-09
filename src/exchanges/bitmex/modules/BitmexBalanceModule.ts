import BigNumber from 'bignumber.js'
import {
  find,
  map,
} from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceGetTradableBalanceParams,
  IAlunaBalanceModule,
} from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Bitmex } from '../Bitmex'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
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

    const market = await BitmexMarketModule.get({
      symbolPair,
    })

    const { instrument } = market

    const { totalSymbolId } = instrument!

    const assetSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: totalSymbolId,
      symbolMappings: Bitmex.settings.mappings,
    })

    const balances = await this.list()

    const desiredAsset = find(balances, ({ symbolId }) => {

      return symbolId === assetSymbolId

    })

    if (!desiredAsset) {

      return 0

    }

    const { available } = desiredAsset

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
