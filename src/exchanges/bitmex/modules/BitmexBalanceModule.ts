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
      requestCount,
    } = await privateRequest<IBitmexBalanceSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITMEX_URL}/user/margin`,
      body: { currency: 'all' },
      keySecret: this.exchange.keySecret,
    })

    return {
      rawBalances,
      requestCount,
    }

  }

  public async list (): Promise<IAlunaBalanceListReturns> {

    const requestCount = 0

    const {
      rawBalances,
      requestCount: listRawCount,
    } = await this.listRaw()

    const {
      balances: parsedBalances,
      requestCount: parseManyCount,
    } = this.parseMany({ rawBalances })

    const totalRequestCount = requestCount
        + listRawCount
        + parseManyCount

    return {
      balances: parsedBalances,
      requestCount: totalRequestCount,
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
      requestCount: 0,
    }

  }

  public parseMany (params: {
    rawBalances: IBitmexBalanceSchema[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let requestCount = 0

    const parsedBalances = map(rawBalances, (rawBalance) => {

      const {
        balance: parsedBalance,
        requestCount: parseCount,
      } = this.parse({
        rawBalance,
      })

      requestCount += parseCount

      return parsedBalance

    })

    BitmexLog.info(`parsed ${parsedBalances.length} balances for BitMEX`)

    return {
      balances: parsedBalances,
      requestCount,
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

    const requestCount = 0

    BitmexLog.info(`fetching Bitmex tradable balance for ${symbolPair}`)

    const { market, requestCount: getCount } = await BitmexMarketModule.get({
      id: symbolPair,
    })

    const { instrument } = market

    const { totalSymbolId } = instrument!

    const assetSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: totalSymbolId,
      symbolMappings: Bitmex.settings.mappings,
    })

    const { balances } = await this.list()

    const desiredAsset = find(balances, ({ symbolId }) => {

      return symbolId === assetSymbolId

    })

    let totalRequestCount = 0

    if (!desiredAsset) {

      totalRequestCount = requestCount + getCount

      return {
        tradableBalance: 0,
        requestCount: totalRequestCount,
      }

    }

    const { available } = desiredAsset

    const {
      leverage,
      requestCount: getLeverageCount,
    } = await this.exchange.position!.getLeverage!({
      symbolPair,
    })

    const computedLeverage = leverage === 0
      ? 1
      : leverage

    const tradableBalance = new BigNumber(available)
      .times(computedLeverage)
      .toNumber()


    totalRequestCount = requestCount
      + getCount
      + getLeverageCount

    return {
      tradableBalance,
      requestCount: totalRequestCount,
    }

  }

}
