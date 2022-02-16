import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
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

  public static async listRaw (): Promise<IBittrexMarketWithTicker[]> {

    const { publicRequest } = BittrexHttp

    BittrexLog.info('fetching Bittrex market summaries')

    const rawMarketSummaries = await
    publicRequest<IBittrexMarketSummarySchema[]>({
      url: `${PROD_BITTREX_URL}/markets/summaries`,
    })

    BittrexLog.info('fetching Bittrex tickers')

    const rawMarketTickers = await publicRequest<IBittrexMarketTickerSchema[]>({
      url: `${PROD_BITTREX_URL}/markets/tickers`,
    })

    const rawMarketsWithTicker = BittrexTickerMarketParser.parse({
      rawMarketSummaries,
      rawMarketTickers,
    })

    return rawMarketsWithTicker

  }



  public static async list (): Promise<IAlunaMarketSchema[]> {

    const rawMarkets = await BittrexMarketModule.listRaw()

    const parsedMarkets = BittrexMarketModule.parseMany({ rawMarkets })

    return parsedMarkets

  }



  public static parse (params: {
    rawMarket: IBittrexMarketWithTicker,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const parsedMarket = BittrexMarketParser.parse({ rawMarket })

    return parsedMarket

  }



  public static parseMany (params: {
    rawMarkets: IBittrexMarketWithTicker[],
  }): IAlunaMarketSchema[] {

    const { rawMarkets } = params

    const parsedMarkets = rawMarkets.map((rawMarket) => {

      const parsedMarket = BittrexMarketParser.parse({ rawMarket })

      return parsedMarket

    })

    BittrexLog.info(`parsed ${parsedMarkets.length} markets for Bittrex`)

    return parsedMarkets

  }

}
