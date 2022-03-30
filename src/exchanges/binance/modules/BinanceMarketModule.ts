import {
  IAlunaMarketListRawReturns,
  IAlunaMarketListReturns,
  IAlunaMarketModule,
  IAlunaMarketParseManyReturns,
  IAlunaMarketParseReturns,
} from '../../../lib/modules/IAlunaMarketModule'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import { PROD_BINANCE_URL } from '../BinanceSpecs'
import {
  IBinanceMarketSchema,
  IBinanceMarketWithCurrency,
} from '../schemas/IBinanceMarketSchema'
import { BinanceCurrencyMarketParser } from '../schemas/parses/BinanceCurrencyMarketParser'
import { BinanceMarketParser } from '../schemas/parses/BinanceMarketParser'
import { BinanceSymbolModule } from './BinanceSymbolModule'



export const BinanceMarketModule: IAlunaMarketModule = class {

  public static async listRaw ()
    : Promise<IAlunaMarketListRawReturns<IBinanceMarketWithCurrency>> {

    const { publicRequest } = BinanceHttp

    let apiRequestCount = 0

    BinanceLog.info('fetching Binance markets')

    const {
      data: rawMarkets,
      apiRequestCount: requestCount,
    } = await publicRequest<IBinanceMarketSchema[]>({
      url: `${PROD_BINANCE_URL}/api/v3/ticker/24hr`,
    })

    const {
      rawSymbols,
      apiRequestCount: listRawCount,
    } = await BinanceSymbolModule.listRaw()

    apiRequestCount += 1

    const rawMarketsWithCurrency = BinanceCurrencyMarketParser.parse({
      rawMarkets,
      rawSymbols,
    })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
      + listRawCount
      + requestCount

    return {
      rawMarkets: rawMarketsWithCurrency,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public static async list (): Promise<IAlunaMarketListReturns> {

    let apiRequestCount = 0

    const {
      rawMarkets,
      apiRequestCount: listRawCount,
    } = await BinanceMarketModule.listRaw()

    apiRequestCount += 1

    const {
      markets: parsedMarkets,
      apiRequestCount: parseManyCount,
    } = BinanceMarketModule.parseMany({ rawMarkets })

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
    rawMarket: IBinanceMarketWithCurrency,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = BinanceMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      apiRequestCount: 1,
    }

  }



  public static parseMany (params: {
    rawMarkets: IBinanceMarketWithCurrency[],
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

    BinanceLog.info(`parsed ${parsedMarkets.length} markets for Binance`)

    return {
      markets: parsedMarkets,
      apiRequestCount,
    }

  }

}
