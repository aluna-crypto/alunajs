import {
  IAlunaMarketListRawReturns,
  IAlunaMarketListReturns,
  IAlunaMarketModule,
  IAlunaMarketParseManyReturns,
  IAlunaMarketParseReturns,
} from '../../../lib/modules/IAlunaMarketModule'
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import { IGateioMarketSchema } from '../schemas/IGateioMarketSchema'
import { GateioMarketParser } from '../schemas/parsers/GateioMarketParser'



export const GateioMarketModule: IAlunaMarketModule = class {

  public static async listRaw ()
    : Promise<IAlunaMarketListRawReturns<IGateioMarketSchema>> {

    const { publicRequest } = GateioHttp

    GateioLog.info('fetching Gateio markets')

    const {
      data: rawMarkets,
      requestCount,
    } = await publicRequest<IGateioMarketSchema[]>({
      url: `${PROD_GATEIO_URL}/spot/tickers`,
    })

    return {
      rawMarkets,
      requestCount,
    }

  }



  public static async list (): Promise<IAlunaMarketListReturns> {

    const requestCount = 0

    const {
      requestCount: listRawCount,
      rawMarkets,
    } = await GateioMarketModule.listRaw()

    const {
      requestCount: parseManyCount,
      markets: parsedMarkets,
    } = GateioMarketModule.parseMany({ rawMarkets })

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      markets: parsedMarkets,
      requestCount: totalRequestCount,
    }

  }



  public static parse (params: {
    rawMarket: IGateioMarketSchema,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = GateioMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      requestCount: 0,
    }

  }



  public static parseMany (params: {
    rawMarkets: IGateioMarketSchema[],
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

    GateioLog.info(`parsed ${parsedMarkets.length} markets for Gateio`)

    return {
      markets: parsedMarkets,
      requestCount,
    }

  }

}
