import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { PROD_BINANCE_URL } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import {
  IBinanceMarketSchema,
  IBinanceMarketWithCurrency,
} from '../schemas/IBinanceMarketSchema'
import { BinanceCurrencyMarketParser } from '../schemas/parses/BinanceCurrencyMarketParser'
import { BinanceMarketParser } from '../schemas/parses/BinanceMarketParser'
import { BinanceSymbolModule } from './BinanceSymbolModule'



export const BinanceMarketModule: IAlunaMarketModule = class {

  public static async listRaw (): Promise<IBinanceMarketWithCurrency[]> {

    const { publicRequest } = BinanceHttp

    BinanceLog.info('fetching Binance markets')

    const rawMarkets = await publicRequest<IBinanceMarketSchema[]>({
      url: `${PROD_BINANCE_URL}/api/v3/ticker/24hr`,
    })

    BinanceLog.info('fetching Binance symbols')

    const rawSymbols = await BinanceSymbolModule.listRaw()

    const rawMarketsWithCurrency = BinanceCurrencyMarketParser.parse({
      rawMarkets,
      rawSymbols,
    })

    return rawMarketsWithCurrency

  }

  public static async list (): Promise<IAlunaMarketSchema[]> {

    const rawMarkets = await BinanceMarketModule.listRaw()

    const parsedMarkets = BinanceMarketModule.parseMany({ rawMarkets })

    return parsedMarkets

  }

  public static parse (params: {
    rawMarket: IBinanceMarketWithCurrency,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const parsedMarket = BinanceMarketParser.parse({ rawMarket })

    return parsedMarket

  }

  public static parseMany (params: {
    rawMarkets: IBinanceMarketWithCurrency[],
  }): IAlunaMarketSchema[] {

    const { rawMarkets } = params

    const parsedMarkets = rawMarkets.map((rawMarket) => {

      const parsedMarket = BinanceMarketParser.parse({ rawMarket })

      return parsedMarket

    })

    BinanceLog.info(`parsed ${parsedMarkets.length} markets for Binance`)

    return parsedMarkets

  }

}
