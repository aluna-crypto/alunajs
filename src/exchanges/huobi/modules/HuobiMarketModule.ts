import {
  IAlunaMarketListRawReturns,
  IAlunaMarketListReturns,
  IAlunaMarketModule,
  IAlunaMarketParseManyReturns,
  IAlunaMarketParseReturns,
} from '../../../lib/modules/IAlunaMarketModule'
import { HuobiHttp } from '../HuobiHttp'
import { HuobiLog } from '../HuobiLog'
import { PROD_HUOBI_URL } from '../HuobiSpecs'
import {
  IHuobiMarketSchema,
  IHuobiMarketWithCurrency,
} from '../schemas/IHuobiMarketSchema'
import { HuobiCurrencyMarketParser } from '../schemas/parsers/HuobiCurrencyMarketParser'
import { HuobiMarketParser } from '../schemas/parsers/HuobiMarketParser'
import { HuobiSymbolModule } from './HuobiSymbolModule'



export const HuobiMarketModule: IAlunaMarketModule = class {

  public static async listRaw ()
    : Promise<IAlunaMarketListRawReturns<IHuobiMarketWithCurrency>> {

    const { publicRequest } = HuobiHttp

    const requestCount = 0

    HuobiLog.info('fetching Huobi markets')

    const {
      data: rawMarkets,
      requestCount: publicRequestCount,
    } = await publicRequest<IHuobiMarketSchema[]>({
      url: `${PROD_HUOBI_URL}/market/tickers`,
    })

    const {
      rawSymbols,
      requestCount: listRawCount,
    } = await HuobiSymbolModule.listRaw()

    const rawMarketsWithCurrency = HuobiCurrencyMarketParser.parse({
      rawMarkets,
      rawSymbols,
    })

    const totalRequestCount = requestCount
    + publicRequestCount
    + listRawCount

    return {
      rawMarkets: rawMarketsWithCurrency,
      requestCount: totalRequestCount,
    }

  }



  public static async list (): Promise<IAlunaMarketListReturns> {

    const requestCount = 0

    const {
      rawMarkets,
      requestCount: listRawCount,
    } = await HuobiMarketModule.listRaw()

    const {
      markets: parsedMarkets,
      requestCount: parseManyCount,
    } = HuobiMarketModule.parseMany({ rawMarkets })

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      markets: parsedMarkets,
      requestCount: totalRequestCount,
    }

  }



  public static parse (params: {
    rawMarket: IHuobiMarketWithCurrency,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = HuobiMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      requestCount: 0,
    }

  }



  public static parseMany (params: {
    rawMarkets: IHuobiMarketWithCurrency[],
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

    HuobiLog.info(`parsed ${parsedMarkets.length} markets for Huobi`)

    return {
      markets: parsedMarkets,
      requestCount,
    }

  }

}
