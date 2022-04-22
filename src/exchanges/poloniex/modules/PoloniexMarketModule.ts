import {
  forOwn,
  map,
} from 'lodash'

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
import { PoloniexMarketParser } from '../schemas/parsers/PoloniexMarketParser'



export const PoloniexMarketModule: IAlunaMarketModule = class {

  public static async listRaw ()
    : Promise<IAlunaMarketListRawReturns<IPoloniexMarketWithCurrency>> {

    const { publicRequest } = PoloniexHttp

    PoloniexLog.info('fetching Poloniex markets')

    const query = new URLSearchParams()

    query.append('command', 'returnTicker')

    let requestCount = 0

    const {
      data: rawMarkets,
      requestCount: privateRequestCount,
    } = await publicRequest<IPoloniexMarketSchema>({
      url: `${PROD_POLONIEX_URL}/public?${query.toString()}`,
    })

    requestCount += privateRequestCount

    const rawMarketsWithCurrency: IPoloniexMarketWithCurrency[] = []

    forOwn(rawMarkets, (value, key) => {

      const [quoteCurrency, baseCurrency] = key.split('_')

      const isFrozen = value.isFrozen === '1'

      if (!isFrozen) {

        rawMarketsWithCurrency.push({
          currencyPair: key,
          quoteCurrency,
          baseCurrency,
          ...value,
        })

      }

    })

    return {
      rawMarkets: rawMarketsWithCurrency,
      requestCount,
    }

  }



  public static async list (): Promise<IAlunaMarketListReturns> {

    const requestCount = 0

    const {
      rawMarkets,
      requestCount: listRawCount,
    } = await PoloniexMarketModule.listRaw()

    const {
      markets: parsedMarkets,
      requestCount: parseManyCount,
    } = PoloniexMarketModule.parseMany({ rawMarkets })

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      markets: parsedMarkets,
      requestCount: totalRequestCount,
    }

  }



  public static parse (params: {
    rawMarket: IPoloniexMarketWithCurrency,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = PoloniexMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      requestCount: 0,
    }

  }



  public static parseMany (params: {
    rawMarkets: IPoloniexMarketWithCurrency[],
  }): IAlunaMarketParseManyReturns {

    const { rawMarkets } = params

    let requestCount = 0

    const parsedMarkets = map(rawMarkets, (rawMarket) => {

      const {
        market: parsedMarket,
        requestCount: parseCount,
      } = this.parse({ rawMarket })

      requestCount += parseCount

      return parsedMarket

    })

    PoloniexLog.info(`parsed ${parsedMarkets.length} markets for Poloniex`)

    return {
      markets: parsedMarkets,
      requestCount,
    }

  }

}
