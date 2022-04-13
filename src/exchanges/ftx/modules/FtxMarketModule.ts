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
      requestCount,
    } = await
    publicRequest<IFtxResponseSchema<IFtxMarketSchema[]>>({
      url: `${PROD_FTX_URL}/markets`,
    })

    const filteredSpotMarkets = result.filter(
      (market) => market.type === FtxMarketType.SPOT,
    )

    return {
      rawMarkets: filteredSpotMarkets,
      requestCount,
    }

  }



  public static async list (): Promise<IAlunaMarketListReturns> {

    const requestCount = 0

    const {
      rawMarkets,
      requestCount: listRawCount,
    } = await FtxMarketModule.listRaw()

    const {
      markets: parsedMarkets,
      requestCount: parseManyCount,
    } = FtxMarketModule.parseMany({ rawMarkets })

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      markets: parsedMarkets,
      requestCount: totalRequestCount,
    }

  }



  public static parse (params: {
    rawMarket: IFtxMarketSchema,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = FtxMarketParser.parse({ rawMarket })

    return {
      market: parsedMarket,
      requestCount: 0,
    }

  }



  public static parseMany (params: {
    rawMarkets: IFtxMarketSchema[],
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

    FtxLog.info(`parsed ${parsedMarkets.length} markets for Ftx`)

    return {
      markets: parsedMarkets,
      requestCount,
    }

  }

}
