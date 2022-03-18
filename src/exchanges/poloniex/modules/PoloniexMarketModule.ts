import {
  IAlunaMarketListRawReturns,
  IAlunaMarketListReturns,
  IAlunaMarketModule,
  IAlunaMarketParseManyReturns,
  IAlunaMarketParseReturns,
} from '../../../lib/modules/IAlunaMarketModule'
import { PoloniexHttp } from '../PoloniexHttp'
import { PoloniexLog } from '../PoloniexLog'
import { PROD_POLONIEX_URL } from '../PoloniexSpecs'
import {
  IPoloniexMarketSchema,
  IPoloniexMarketWithCurrency,
} from '../schemas/IPoloniexMarketSchema'
import { PoloniexCurrencyParser } from '../schemas/parsers/PoloniexCurrencyParser'
import { PoloniexMarketParser } from '../schemas/parsers/PoloniexMarketParser'



export const PoloniexMarketModule: IAlunaMarketModule = class {

  public static async listRaw ()
    : Promise<IAlunaMarketListRawReturns<IPoloniexMarketWithCurrency>> {

    const { publicRequest } = PoloniexHttp

    PoloniexLog.info('fetching Poloniex markets')

    const query = new URLSearchParams()

    query.append('command', 'returnTicker')

    let apiRequestCount = 0

    const {
      data: rawMarkets,
      apiRequestCount: requestCount,
    } = await publicRequest<IPoloniexMarketSchema>({
      url: `${PROD_POLONIEX_URL}/public?${query.toString()}`,
    })

    apiRequestCount += requestCount

    const rawMarketsWithCurrency = PoloniexCurrencyParser
      .parse<IPoloniexMarketWithCurrency>({
        rawInfo: rawMarkets,
      })

    apiRequestCount += 1

    return {
      rawMarkets: rawMarketsWithCurrency,
      apiRequestCount,
    }

  }



  public static async list (): Promise<IAlunaMarketListReturns> {

    let apiRequestCount = 0

    const {
      rawMarkets,
      apiRequestCount: listRawCount,
    } = await PoloniexMarketModule.listRaw()

    apiRequestCount += 1

    const {
      markets: parsedMarkets,
      apiRequestCount: parseManyCount,
    } = PoloniexMarketModule.parseMany({ rawMarkets })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
      + listRawCount
      + parseManyCount

    return {
      markets: parsedMarkets,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public static parse (params: {
    rawMarket: IPoloniexMarketWithCurrency,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = PoloniexMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      apiRequestCount: 1,
    }

  }



  public static parseMany (params: {
    rawMarkets: IPoloniexMarketWithCurrency[],
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

    PoloniexLog.info(`parsed ${parsedMarkets.length} markets for Poloniex`)

    return {
      markets: parsedMarkets,
      apiRequestCount,
    }

  }

}
