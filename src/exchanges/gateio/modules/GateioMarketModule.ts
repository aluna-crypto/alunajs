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
      apiRequestCount,
    } = await publicRequest<IGateioMarketSchema[]>({
      url: `${PROD_GATEIO_URL}/spot/tickers`,
    })

    return {
      rawMarkets,
      apiRequestCount,
    }

  }



  public static async list (): Promise<IAlunaMarketListReturns> {

    let apiRequestCount = 0

    const {
      apiRequestCount: listRawCount,
      rawMarkets,
    } = await GateioMarketModule.listRaw()

    apiRequestCount += 1

    const {
      apiRequestCount: parseManyCount,
      markets: parsedMarkets,
    } = GateioMarketModule.parseMany({ rawMarkets })

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
    rawMarket: IGateioMarketSchema,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = GateioMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      apiRequestCount: 1,
    }

  }



  public static parseMany (params: {
    rawMarkets: IGateioMarketSchema[],
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

    GateioLog.info(`parsed ${parsedMarkets.length} markets for Gateio`)

    return {
      markets: parsedMarkets,
      apiRequestCount,
    }

  }

}
