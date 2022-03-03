import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
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

  public static async listRaw (): Promise<IPoloniexMarketWithCurrency[]> {

    const { publicRequest } = PoloniexHttp

    PoloniexLog.info('fetching Poloniex markets')

    const query = new URLSearchParams()

    query.append('command', 'returnTicker')

    const rawMarkets = await publicRequest<IPoloniexMarketSchema>({
      url: `${PROD_POLONIEX_URL}/public?${query.toString()}`,
    })

    const rawMarketsWithCurrency = PoloniexCurrencyParser
      .parse<IPoloniexMarketWithCurrency>({
        rawInfo: rawMarkets,
      })

    return rawMarketsWithCurrency

  }



  public static async list (): Promise<IAlunaMarketSchema[]> {

    const rawMarkets = await PoloniexMarketModule.listRaw()

    const parsedMarkets = PoloniexMarketModule.parseMany({ rawMarkets })

    return parsedMarkets

  }



  public static parse (params: {
    rawMarket: IPoloniexMarketWithCurrency,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const parsedMarket = PoloniexMarketParser.parse({ rawMarket })

    return parsedMarket

  }



  public static parseMany (params: {
    rawMarkets: IPoloniexMarketWithCurrency[],
  }): IAlunaMarketSchema[] {

    const { rawMarkets } = params

    const parsedMarkets = rawMarkets.map((rawMarket) => {

      const parsedMarket = PoloniexMarketParser.parse({ rawMarket })

      return parsedMarket

    })

    PoloniexLog.info(`parsed ${parsedMarkets.length} markets for Poloniex`)

    return parsedMarkets

  }

}
