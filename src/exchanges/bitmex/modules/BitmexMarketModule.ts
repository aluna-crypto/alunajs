import { map } from 'lodash'

import {
  IAlunaMarketGetParams,
  IAlunaMarketGetRawReturns,
  IAlunaMarketGetReturns,
  IAlunaMarketListRawReturns,
  IAlunaMarketListReturns,
  IAlunaMarketModule,
  IAlunaMarketParseManyReturns,
  IAlunaMarketParseReturns,
} from '../../../lib/modules/IAlunaMarketModule'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { IBitmexMarketsSchema } from '../schemas/IBitmexMarketsSchema'
import { BitmexMarketParser } from '../schemas/parsers/BitmexMarketParser'
import { BitmexSymbolModule } from './BitmexSymbolModule'



export const BitmexMarketModule: Required<IAlunaMarketModule> = class {


  public static async listRaw ()
    : Promise<IAlunaMarketListRawReturns<IBitmexMarketsSchema>> {

    BitmexLog.info('fetching Bitmex markets')

    const { rawSymbols, apiRequestCount } = await BitmexSymbolModule.listRaw()

    return {
      rawMarkets: rawSymbols,
      apiRequestCount: apiRequestCount + 1,
    }

  }

  public static async list (): Promise<IAlunaMarketListReturns> {

    let apiRequestCount = 0

    const {
      rawMarkets,
      apiRequestCount: listRawCount,
    } = await BitmexMarketModule.listRaw()

    apiRequestCount += 1

    const {
      markets: parsedMarkets,
      apiRequestCount: parseManyCount,
    } = BitmexMarketModule.parseMany({ rawMarkets })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
      + listRawCount
      + parseManyCount

    return {
      markets: parsedMarkets,
      apiRequestCount: totalApiRequestCount,
    }

  }

  public static async getRaw (params: IAlunaMarketGetParams)
    : Promise<IAlunaMarketGetRawReturns> {

    const { id } = params

    const { publicRequest } = BitmexHttp

    const {
      data,
      apiRequestCount,
    } = await publicRequest<IBitmexMarketsSchema[]>({
      url: `${PROD_BITMEX_URL}/instrument?symbol=${id}`,
    })

    const [rawMarket] = data

    return {
      rawMarket,
      apiRequestCount,
    }

  }

  public static async get (params: IAlunaMarketGetParams)
    : Promise<IAlunaMarketGetReturns> {

    const { id } = params

    let apiRequestCount = 0

    const {
      apiRequestCount: getRawCount,
      rawMarket,
    } = await this.getRaw({ id })

    apiRequestCount += 1

    const {
      market: parsedMarket,
      apiRequestCount: parseCount,
    } = this.parse({ rawMarket })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
          + getRawCount
          + parseCount

    return {
      market: parsedMarket,
      apiRequestCount: totalApiRequestCount,
    }


  }

  public static parse (params: {
    rawMarket: IBitmexMarketsSchema,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = BitmexMarketParser.parse({
      rawMarket,
    })

    return {
      market: parsedMarket,
      apiRequestCount: 1,
    }

  }

  public static parseMany (params: {
    rawMarkets: IBitmexMarketsSchema[],
  }): IAlunaMarketParseManyReturns {

    const { rawMarkets } = params

    let apiRequestCount = 0

    const parsedMarkets = map(rawMarkets, (rawMarket) => {

      const {
        market: parsedMarket,
        apiRequestCount: parseCount,
      } = this.parse({ rawMarket })

      apiRequestCount += parseCount + 1

      return parsedMarket

    })

    BitmexLog.info(`parsed ${parsedMarkets.length} markets for Bitmex`)

    return {
      markets: parsedMarkets,
      apiRequestCount,
    }

  }

}
