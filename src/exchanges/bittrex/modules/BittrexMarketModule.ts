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

    let apiRequestCount = 0

    const {
      data: rawMarketSummaries,
      apiRequestCount: summariesRequestCount,
    } = await
    publicRequest<IBittrexMarketSummarySchema[]>({
      url: `${PROD_BITTREX_URL}/markets/summaries`,
    })

    BittrexLog.info('fetching Bittrex tickers')

    const {
      data: rawMarketTickers,
      apiRequestCount: tickersRequestCount,
    } = await publicRequest<IBittrexMarketTickerSchema[]>({
      url: `${PROD_BITTREX_URL}/markets/tickers`,
    })

    const rawMarketsWithTicker = BittrexTickerMarketParser.parse({
      rawMarketSummaries,
      rawMarketTickers,
    })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
    + tickersRequestCount
    + summariesRequestCount

    return {
      rawMarkets: rawMarketsWithTicker,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public static async list (): Promise<IAlunaMarketListReturns> {

    let apiRequestCount = 0

    const {
      rawMarkets,
      apiRequestCount: listRawCount,
    } = await BittrexMarketModule.listRaw()

    apiRequestCount += 1

    const {
      markets: parsedMarkets,
      apiRequestCount: parseManyCount,
    } = BittrexMarketModule.parseMany({ rawMarkets })

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
    rawMarket: IBittrexMarketWithTicker,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = BittrexMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      apiRequestCount: 1,
    }

  }



  public static parseMany (params: {
    rawMarkets: IBittrexMarketWithTicker[],
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

    BittrexLog.info(`parsed ${parsedMarkets.length} markets for Bittrex`)

    return {
      markets: parsedMarkets,
      apiRequestCount,
    }

  }

}
