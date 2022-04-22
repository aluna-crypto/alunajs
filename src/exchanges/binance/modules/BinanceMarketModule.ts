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
import { BinanceMarketFilter } from '../schemas/filters/BinanceMarketFilter'
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

    const requestCount = 0

    BinanceLog.info('fetching Binance markets')

    const {
      data: rawMarkets,
      requestCount: publicRequestCount,
    } = await publicRequest<IBinanceMarketSchema[]>({
      url: `${PROD_BINANCE_URL}/api/v3/ticker/24hr`,
    })

    const {
      rawSymbols,
      requestCount: listRawCount,
    } = await BinanceSymbolModule.listRaw()

    const filteredActiveMarkets = BinanceMarketFilter.filter({
      rawMarkets,
      rawSymbols,
    })

    const rawMarketsWithCurrency = BinanceCurrencyMarketParser.parse({
      rawMarkets: filteredActiveMarkets,
      rawSymbols,
    })

    const totalRequestCount = requestCount
      + listRawCount
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
    } = await BinanceMarketModule.listRaw()

    const {
      markets: parsedMarkets,
      requestCount: parseManyCount,
    } = BinanceMarketModule.parseMany({ rawMarkets })

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      markets: parsedMarkets,
      requestCount: totalRequestCount,
    }

  }



  public static parse (params: {
    rawMarket: IBinanceMarketWithCurrency,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = BinanceMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      requestCount: 0,
    }

  }



  public static parseMany (params: {
    rawMarkets: IBinanceMarketWithCurrency[],
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

    BinanceLog.info(`parsed ${parsedMarkets.length} markets for Binance`)

    return {
      markets: parsedMarkets,
      requestCount,
    }

  }

}
