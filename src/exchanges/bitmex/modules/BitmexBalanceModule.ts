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
  IAlunaBalanceGetTradableBalanceReturns,
  IAlunaBalanceListRawReturns,
  IAlunaBalanceListReturns,
  IAlunaBalanceModule,
  IAlunaBalanceParseManyReturns,
  IAlunaBalanceParseReturns,
} from '../../../lib/modules/IAlunaBalanceModule'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { BitmexSettlementCurrencyEnum } from '../enums/BitmexSettlementCurrencyEnum'
import { IBitmexBalanceSchema } from '../schemas/IBitmexBalanceSchema'
import { BitmexBalanceParser } from '../schemas/parsers/BitmexBalanceParser'
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

    const { symbolPair } = params

    let apiRequestCount = 0

    BitmexLog.info(`fetching Bitmex tradable balance for ${symbolPair}`)

    const {
      rawMarket: settlCurrency,
      apiRequestCount: getRawCount,
    } = await BitmexMarketModule.getRaw({
      id: symbolPair,
    })

    apiRequestCount += 1

    const { balances, apiRequestCount: listCount } = await this.list()

    apiRequestCount += 1

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

    const totalApiRequestCount = apiRequestCount
      + getRawCount
      + listCount
      + getLeverageCount


    return {
      tradableBalance,
      apiRequestCount: totalApiRequestCount,
    }

  }

}
