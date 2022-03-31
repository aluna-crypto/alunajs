import {
  IAlunaMarketListRawReturns,
  IAlunaMarketListReturns,
  IAlunaMarketModule,
  IAlunaMarketParseManyReturns,
  IAlunaMarketParseReturns,
} from '../../../lib/modules/IAlunaMarketModule'
import { BittrexHttp } from '../BittrexHttp'
import { BittrexLog } from '../BittrexLog'
import { PROD_BITTREX_URL } from '../BittrexSpecs'
import {
  IBittrexMarketSummarySchema,
  IBittrexMarketTickerSchema,
  IBittrexMarketWithTicker,
} from '../schemas/IBittrexMarketSchema'
import { BittrexMarketParser } from '../schemas/parses/BittrexMarketParser'
import { BittrexTickerMarketParser } from '../schemas/parses/BittrexTickerMarketParser'



export const BittrexMarketModule: IAlunaMarketModule = class {

  public static async listRaw ()
    : Promise<IAlunaMarketListRawReturns<IBittrexMarketWithTicker>> {

    const { publicRequest } = BittrexHttp

    BittrexLog.info('fetching Bittrex market summaries')

    const requestCount = 0

    const {
      data: rawMarketSummaries,
      requestCount: summariesRequestCount,
    } = await
    publicRequest<IBittrexMarketSummarySchema[]>({
      url: `${PROD_BITTREX_URL}/markets/summaries`,
    })

    BittrexLog.info('fetching Bittrex tickers')

    const {
      data: rawMarketTickers,
      requestCount: tickersRequestCount,
    } = await publicRequest<IBittrexMarketTickerSchema[]>({
      url: `${PROD_BITTREX_URL}/markets/tickers`,
    })

    const rawMarketsWithTicker = BittrexTickerMarketParser.parse({
      rawMarketSummaries,
      rawMarketTickers,
    })

    const totalRequestCount = requestCount
    + tickersRequestCount
    + summariesRequestCount

    return {
      rawMarkets: rawMarketsWithTicker,
      requestCount: totalRequestCount,
    }

  }



  public static async list (): Promise<IAlunaMarketListReturns> {

    const requestCount = 0

    const {
      rawMarkets,
      requestCount: listRawCount,
    } = await BittrexMarketModule.listRaw()

    const {
      markets: parsedMarkets,
      requestCount: parseManyCount,
    } = BittrexMarketModule.parseMany({ rawMarkets })

    const totalRequestCount = listRawCount
      + parseManyCount
      + requestCount

    return {
      markets: parsedMarkets,
      requestCount: totalRequestCount,
    }

  }



  public static parse (params: {
    rawMarket: IBittrexMarketWithTicker,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = BittrexMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      requestCount: 0,
    }

  }



  public static parseMany (params: {
    rawMarkets: IBittrexMarketWithTicker[],
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

    BittrexLog.info(`parsed ${parsedMarkets.length} markets for Bittrex`)

    return {
      markets: parsedMarkets,
      requestCount,
    }

  }

}
