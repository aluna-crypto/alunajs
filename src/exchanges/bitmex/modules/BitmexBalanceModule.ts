import BigNumber from 'bignumber.js'
import {
  find,
  map,
} from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceGetTradableBalanceParams,
  IAlunaBalanceGetTradableBalanceReturns,
  IAlunaBalanceListRawReturns,
  IAlunaBalanceListReturns,
  IAlunaBalanceModule,
  IAlunaBalanceParseManyReturns,
  IAlunaBalanceParseReturns,
} from '../../../lib/modules/IAlunaBalanceModule'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { validateParams } from '../../../utils/validation/validateParams'
import { Bitmex } from '../Bitmex'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { IBitmexBalanceSchema } from '../schemas/IBitmexBalanceSchema'
import { BitmexBalanceParser } from '../schemas/parsers/BitmexBalanceParser'
import { bitmexGetTradableBalanceParamsSchema } from '../validation/schemas/bitmexGetTradableBalanceParamsSchema'
import { BitmexMarketModule } from './BitmexMarketModule'



export class BitmexBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw ()
    : Promise<IAlunaBalanceListRawReturns<IBitmexBalanceSchema>> {

    BitmexLog.info('fetching BitMEX balances')

    const { privateRequest } = BitmexHttp

    const {
      data: rawBalances,
      apiRequestCount,
    } = await privateRequest<IBitmexBalanceSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITMEX_URL}/user/margin`,
      body: { currency: 'all' },
      keySecret: this.exchange.keySecret,
    })

    return {
      rawBalances,
      apiRequestCount,
    }

  }

  public async list (): Promise<IAlunaBalanceListReturns> {

    let apiRequestCount = 0

    const {
      rawBalances,
      apiRequestCount: listRawCount,
    } = await this.listRaw()

    apiRequestCount += 1

    const {
      balances: parsedBalances,
      apiRequestCount: parseManyCount,
    } = this.parseMany({ rawBalances })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
        + listRawCount
        + parseManyCount

    return {
      balances: parsedBalances,
      apiRequestCount: totalApiRequestCount,
    }

  }

  public parse (params: {
    rawBalance: IBitmexBalanceSchema,
  }): IAlunaBalanceParseReturns {

    const { rawBalance } = params

    const parsedBalance = BitmexBalanceParser.parse({
      rawBalance,
    })

    return {
      balance: parsedBalance,
      apiRequestCount: 1,
    }

  }

  public parseMany (params: {
    rawBalances: IBitmexBalanceSchema[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let apiRequestCount = 0

    const parsedBalances = map(rawBalances, (rawBalance) => {

      const {
        balance: parsedBalance,
        apiRequestCount: parseCount,
      } = this.parse({
        rawBalance,
      })

      apiRequestCount += parseCount + 1

      return parsedBalance

    })

    BitmexLog.info(`parsed ${parsedBalances.length} balances for BitMEX`)

    return {
      balances: parsedBalances,
      apiRequestCount,
    }

  }

  public async getTradableBalance (
    params: IAlunaBalanceGetTradableBalanceParams,
  ): Promise<IAlunaBalanceGetTradableBalanceReturns> {

    validateParams({
      params,
      schema: bitmexGetTradableBalanceParamsSchema,
    })

    const { symbolPair } = params

    let apiRequestCount = 0

    BitmexLog.info(`fetching Bitmex tradable balance for ${symbolPair}`)

    const { market, apiRequestCount: getCount } = await BitmexMarketModule.get({
      id: symbolPair,
    })

    apiRequestCount += 1

    const { instrument } = market

    const { totalSymbolId } = instrument!

    const assetSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: totalSymbolId,
      symbolMappings: Bitmex.settings.mappings,
    })

    apiRequestCount += 1

    const { balances } = await this.list()

    apiRequestCount += 1

    const desiredAsset = find(balances, ({ symbolId }) => {

      return symbolId === assetSymbolId

    })

    let totalApiRequestCount = 0

    if (!desiredAsset) {

      totalApiRequestCount = apiRequestCount + getCount

      return {
        tradableBalance: 0,
        apiRequestCount: totalApiRequestCount,
      }

    }

    const { available } = desiredAsset

    const {
      leverage,
      apiRequestCount: getLeverageCount,
    } = await this.exchange.position!.getLeverage!({
      symbolPair,
    })

    apiRequestCount += 1

    const computedLeverage = leverage === 0
      ? 1
      : leverage

    const tradableBalance = new BigNumber(available)
      .times(computedLeverage)
      .toNumber()


    totalApiRequestCount = apiRequestCount
      + getCount
      + getLeverageCount

    return {
      tradableBalance,
      apiRequestCount: totalApiRequestCount,
    }

  }

}
