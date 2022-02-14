import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import {
  IGateioMarketSchema,
  IGateioMarketWithCurrency,
} from '../schemas/IGateioMarketSchema'
import { GateioCurrencyMarketParser } from '../schemas/parsers/GateioCurrencyMarketParser'
import { GateioMarketParser } from '../schemas/parsers/GateioMarketParser'



export const GateioMarketModule: IAlunaMarketModule = class {

  public static async listRaw (): Promise<IGateioMarketWithCurrency[]> {

    const { publicRequest } = GateioHttp

    GateioLog.info('fetching Gateio markets')

    const rawMarkets = await publicRequest<IGateioMarketSchema[]>({
      url: `${PROD_GATEIO_URL}/spot/tickers`,
    })

    const rawMarketsWithCurrency = GateioCurrencyMarketParser.parse({
      rawMarkets,
    })

    return rawMarketsWithCurrency

  }



  public static async list (): Promise<IAlunaMarketSchema[]> {

    const rawMarkets = await GateioMarketModule.listRaw()

    const parsedMarkets = GateioMarketModule.parseMany({ rawMarkets })

    return parsedMarkets

  }



  public static parse (params: {
    rawMarket: IGateioMarketWithCurrency,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const parsedMarket = GateioMarketParser.parse({ rawMarket })

    return parsedMarket

  }



  public static parseMany (params: {
    rawMarkets: IGateioMarketWithCurrency[],
  }): IAlunaMarketSchema[] {

    const { rawMarkets } = params

    const parsedMarkets = rawMarkets.map((rawMarket) => {

      const parsedMarket = GateioMarketParser.parse({ rawMarket })

      return parsedMarket

    })

    GateioLog.info(`parsed ${parsedMarkets.length} markets for Gateio`)

    return parsedMarkets

  }

}
