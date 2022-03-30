import {
  IAlunaMarketListRawReturns,
  IAlunaMarketListReturns,
  IAlunaMarketModule,
  IAlunaMarketParseManyReturns,
  IAlunaMarketParseReturns,
} from '../../../lib/modules/IAlunaMarketModule'
import { FtxHttp } from '../FtxHttp'
import { FtxLog } from '../FtxLog'
import { PROD_FTX_URL } from '../FtxSpecs'
import {
  FtxMarketType,
  IFtxMarketSchema,
} from '../schemas/IFtxMarketSchema'
import { IFtxResponseSchema } from '../schemas/IFtxSchema'
import { FtxMarketParser } from '../schemas/parsers/FtxMarketParser'



export const FtxMarketModule: IAlunaMarketModule = class {

  public static async listRaw ()
    : Promise<IAlunaMarketListRawReturns<IFtxMarketSchema>> {

    const { publicRequest } = FtxHttp

    FtxLog.info('fetching Ftx markets')

    const {
      data: { result },
      apiRequestCount,
    } = await
    publicRequest<IFtxResponseSchema<IFtxMarketSchema[]>>({
      url: `${PROD_FTX_URL}/markets`,
    })

    const filteredSpotMarkets = result.filter(
      (market) => market.type === FtxMarketType.SPOT,
    )

    return {
      rawMarkets: filteredSpotMarkets,
      apiRequestCount,
    }

  }



  public static async list (): Promise<IAlunaMarketListReturns> {

    let apiRequestCount = 0

    const {
      rawMarkets,
      apiRequestCount: listRawCount,
    } = await FtxMarketModule.listRaw()

    apiRequestCount += 1

    const {
      markets: parsedMarkets,
      apiRequestCount: parseManyCount,
    } = FtxMarketModule.parseMany({ rawMarkets })

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
    rawMarket: IFtxMarketSchema,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = FtxMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      apiRequestCount: 1,
    }

  }



  public static parseMany (params: {
    rawMarkets: IFtxMarketSchema[],
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

    FtxLog.info(`parsed ${parsedMarkets.length} markets for Ftx`)

    return {
      markets: parsedMarkets,
      apiRequestCount,
    }

  }

}
