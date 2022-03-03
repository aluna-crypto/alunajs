import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
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

  public static async listRaw (): Promise<IFtxMarketSchema[]> {

    const { publicRequest } = FtxHttp

    FtxLog.info('fetching Ftx markets')

    const { result } = await
    publicRequest<IFtxResponseSchema<IFtxMarketSchema[]>>({
      url: `${PROD_FTX_URL}/markets`,
    })

    const filteredSpotMarkets = result.filter(
      (market) => market.type === FtxMarketType.SPOT,
    )

    return filteredSpotMarkets

  }



  public static async list (): Promise<IAlunaMarketSchema[]> {

    const rawMarkets = await FtxMarketModule.listRaw()

    const parsedMarkets = FtxMarketModule.parseMany({ rawMarkets })

    return parsedMarkets

  }



  public static parse (params: {
    rawMarket: IFtxMarketSchema,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const parsedMarket = FtxMarketParser.parse({ rawMarket })

    return parsedMarket

  }



  public static parseMany (params: {
    rawMarkets: IFtxMarketSchema[],
  }): IAlunaMarketSchema[] {

    const { rawMarkets } = params

    const parsedMarkets = rawMarkets.map((rawMarket) => {

      const parsedMarket = FtxMarketParser.parse({ rawMarket })

      return parsedMarket

    })

    FtxLog.info(`parsed ${parsedMarkets.length} markets for Ftx`)

    return parsedMarkets

  }

}
