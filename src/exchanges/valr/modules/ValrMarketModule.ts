import {
  IAlunaMarketListRawReturns,
  IAlunaMarketListReturns,
  IAlunaMarketModule,
  IAlunaMarketParseManyReturns,
  IAlunaMarketParseReturns,
} from '../../../lib/modules/IAlunaMarketModule'
import {
  IValrCurrencyPairs,
  IValrCurrencyPairsResponseSchema,
  IValrMarketResponseSchema,
  IValrMarketSchema,
  IValrMarketWithCurrencies,
} from '../schemas/IValrMarketSchema'
import { ValrCurrencyPairsParser } from '../schemas/parsers/ValrCurrencyPairsParser'
import { ValrMarketParser } from '../schemas/parsers/ValrMarketParser'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



interface IValrMarketModule extends IAlunaMarketModule {
  fetchMarkets (): Promise<IValrMarketResponseSchema>
  fetchCurrencyPairs (): Promise<IValrCurrencyPairsResponseSchema>
}

export const ValrMarketModule: IValrMarketModule = class {

  public static async listRaw ()
    : Promise<IAlunaMarketListRawReturns<IValrMarketWithCurrencies>> {

    ValrLog.info('fetching Valr markets')

    let apiRequestCount = 0

    const {
      markets: rawMarkets,
      apiRequestCount: apiMarketCount,
    } = await this.fetchMarkets()

    apiRequestCount += 1

    ValrLog.info('fetching Valr currency pairs')

    const {
      currencyPairs: rawCurrencyPairs,
      apiRequestCount: apiCurrencyPairCount,
    } = await this.fetchCurrencyPairs()

    apiRequestCount += 1

    const rawMarketsWithCurrency = ValrCurrencyPairsParser.parse({
      rawMarkets,
      rawCurrencyPairs,
    })

    apiRequestCount += 1

    const totalApiRequestCount = apiMarketCount
      + apiCurrencyPairCount
      + apiRequestCount

    return {
      apiRequestCount: totalApiRequestCount,
      rawMarkets: rawMarketsWithCurrency,
    }

  }

  public static async list (): Promise<IAlunaMarketListReturns> {

    let apiRequestCount = 0

    const {
      apiRequestCount: listRawCount,
      rawMarkets,
    } = await ValrMarketModule.listRaw()

    apiRequestCount += 1

    const {
      markets: parsedMarkets,
      apiRequestCount: parseManyCount,
    } = ValrMarketModule.parseMany({ rawMarkets })

    apiRequestCount += 1

    const totalApiRequestCount = listRawCount
      + parseManyCount
      + apiRequestCount

    return {
      markets: parsedMarkets,
      apiRequestCount: totalApiRequestCount,
    }

  }

  public static parse (params: {
    rawMarket: IValrMarketWithCurrencies,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = ValrMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      apiRequestCount: 1,
    }

  }

  public static parseMany (params: {
    rawMarkets: IValrMarketWithCurrencies[],
  }): IAlunaMarketParseManyReturns {

    const { rawMarkets } = params

    let apiRequestCount = 0

    const parsedMarkets = rawMarkets.map((rawMarket) => {

      const {
        market: parsedMarket,
        apiRequestCount: parseCount,
      } = this.parse({ rawMarket })

      apiRequestCount += parseCount + 1

      return parsedMarket

    })

    ValrLog.info(`parsed ${parsedMarkets.length} markets for Valr`)

    return {
      markets: parsedMarkets,
      apiRequestCount,
    }

  }

  public static async fetchMarkets (): Promise<IValrMarketResponseSchema> {

    const {
      data: markets,
      apiRequestCount,
    } = await ValrHttp.publicRequest<IValrMarketSchema[]>({
      url: 'https://api.valr.com/v1/public/marketsummary',
    })

    return {
      markets,
      apiRequestCount,
    }

  }

  public static async fetchCurrencyPairs ()
    : Promise<IValrCurrencyPairsResponseSchema> {

    const {
      data: currencyPairs,
      apiRequestCount,
    } = await ValrHttp.publicRequest<IValrCurrencyPairs[]>({
      url: 'https://api.valr.com/v1/public/pairs',
    })

    return {
      currencyPairs,
      apiRequestCount,
    }

  }

}
