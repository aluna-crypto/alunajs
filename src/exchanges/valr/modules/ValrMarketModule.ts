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

    const requestCount = 0

    const {
      markets: rawMarkets,
      requestCount: apiMarketCount,
    } = await this.fetchMarkets()

    ValrLog.info('fetching Valr currency pairs')

    const {
      currencyPairs: rawCurrencyPairs,
      requestCount: apiCurrencyPairCount,
    } = await this.fetchCurrencyPairs()

    const rawMarketsWithCurrency = ValrCurrencyPairsParser.parse({
      rawMarkets,
      rawCurrencyPairs,
    })

    const totalRequestCount = apiMarketCount
      + apiCurrencyPairCount
      + requestCount

    return {
      requestCount: totalRequestCount,
      rawMarkets: rawMarketsWithCurrency,
    }

  }

  public static async list (): Promise<IAlunaMarketListReturns> {

    const requestCount = 0

    const {
      requestCount: listRawCount,
      rawMarkets,
    } = await ValrMarketModule.listRaw()

    const {
      markets: parsedMarkets,
      requestCount: parseManyCount,
    } = ValrMarketModule.parseMany({ rawMarkets })

    const totalRequestCount = listRawCount
      + parseManyCount
      + requestCount

    return {
      markets: parsedMarkets,
      requestCount: totalRequestCount,
    }

  }

  public static parse (params: {
    rawMarket: IValrMarketWithCurrencies,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = ValrMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      requestCount: 0,
    }

  }

  public static parseMany (params: {
    rawMarkets: IValrMarketWithCurrencies[],
  }): IAlunaMarketParseManyReturns {

    const { rawMarkets } = params

    let requestCount = 0

    const parsedMarkets = rawMarkets.map((rawMarket) => {

      const {
        market: parsedMarket,
        requestCount: parseCount,
      } = this.parse({ rawMarket })

      requestCount += parseCount

      return parsedMarket

    })

    ValrLog.info(`parsed ${parsedMarkets.length} markets for Valr`)

    return {
      markets: parsedMarkets,
      requestCount,
    }

  }

  public static async fetchMarkets (): Promise<IValrMarketResponseSchema> {

    const {
      data: markets,
      requestCount,
    } = await ValrHttp.publicRequest<IValrMarketSchema[]>({
      url: 'https://api.valr.com/v1/public/marketsummary',
    })

    return {
      markets,
      requestCount,
    }

  }

  public static async fetchCurrencyPairs ()
    : Promise<IValrCurrencyPairsResponseSchema> {

    const {
      data: currencyPairs,
      requestCount,
    } = await ValrHttp.publicRequest<IValrCurrencyPairs[]>({
      url: 'https://api.valr.com/v1/public/pairs',
    })

    return {
      currencyPairs,
      requestCount,
    }

  }

}
