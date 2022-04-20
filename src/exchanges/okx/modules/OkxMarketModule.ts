import { map } from 'lodash'

import {
  IAlunaMarketListRawReturns,
  IAlunaMarketListReturns,
  IAlunaMarketModule,
  IAlunaMarketParseManyReturns,
  IAlunaMarketParseReturns,
} from '../../../lib/modules/IAlunaMarketModule'
import { OkxHttp } from '../OkxHttp'
import { OkxLog } from '../OkxLog'
import { PROD_OKX_URL } from '../OkxSpecs'
import {
  IOkxMarketSchema,
  IOkxMarketWithCurrency,
} from '../schemas/IOkxMarketSchema'
import { OkxMarketParser } from '../schemas/parsers/OkxMarketParser'



export const OkxMarketModule: IAlunaMarketModule = class {

  public static async listRaw ()
    : Promise<IAlunaMarketListRawReturns<IOkxMarketWithCurrency>> {

    const { publicRequest } = OkxHttp

    const requestCount = 0

    OkxLog.info('fetching Okx markets')

    const {
      data: rawMarkets,
      requestCount: publicRequestCount,
    } = await publicRequest<IOkxMarketSchema[]>({
      url: `${PROD_OKX_URL}/market/tickers?instType=SPOT`,
    })

    const rawMarketsWithCurrency: IOkxMarketWithCurrency[] = []

    map(rawMarkets, (rawMarket) => {

      const { instId } = rawMarket

      const [baseCurrency, quoteCurrency] = instId.split('-')

      rawMarketsWithCurrency.push({
        ...rawMarket,
        baseCurrency,
        quoteCurrency,
      })

    })


    const totalRequestCount = requestCount
      + publicRequestCount

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
    } = await OkxMarketModule.listRaw()

    const {
      markets: parsedMarkets,
      requestCount: parseManyCount,
    } = OkxMarketModule.parseMany({ rawMarkets })

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      markets: parsedMarkets,
      requestCount: totalRequestCount,
    }

  }



  public static parse (params: {
    rawMarket: IOkxMarketWithCurrency,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = OkxMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      requestCount: 0,
    }

  }



  public static parseMany (params: {
    rawMarkets: IOkxMarketWithCurrency[],
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

    OkxLog.info(`parsed ${parsedMarkets.length} markets for Okx`)

    return {
      markets: parsedMarkets,
      requestCount,
    }

  }

}
