import { map } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
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

    const { rawSymbols, requestCount } = await BitmexSymbolModule.listRaw()

    return {
      rawMarkets: rawSymbols,
      requestCount,
    }

  }

  public static async list (): Promise<IAlunaMarketListReturns> {

    const requestCount = 0

    const {
      rawMarkets,
      requestCount: listRawCount,
    } = await BitmexMarketModule.listRaw()

    const {
      markets: parsedMarkets,
      requestCount: parseManyCount,
    } = BitmexMarketModule.parseMany({ rawMarkets })

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      markets: parsedMarkets,
      requestCount: totalRequestCount,
    }

  }

  public static async getRaw (params: IAlunaMarketGetParams)
    : Promise<IAlunaMarketGetRawReturns> {

    const { id } = params

    const { publicRequest } = BitmexHttp

    const {
      data,
      requestCount,
    } = await publicRequest<IBitmexMarketsSchema[]>({
      url: `${PROD_BITMEX_URL}/instrument?symbol=${id}`,
    })

    if (!data.length) {

      const alunaError = new AlunaError({
        code: AlunaGenericErrorCodes.NOT_FOUND,
        message: `No market found for: ${id}`,
        metadata: data,
      })

      BitmexLog.error(alunaError)

      throw alunaError

    }

    return {
      rawMarket: data[0],
      requestCount,
    }

  }

  public static async get (params: IAlunaMarketGetParams)
    : Promise<IAlunaMarketGetReturns> {

    const { id } = params

    const requestCount = 0

    const {
      requestCount: getRawCount,
      rawMarket,
    } = await this.getRaw({ id })

    const {
      market: parsedMarket,
      requestCount: parseCount,
    } = this.parse({ rawMarket })

    const totalRequestCount = requestCount
          + getRawCount
          + parseCount

    return {
      market: parsedMarket,
      requestCount: totalRequestCount,
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
      requestCount: 0,
    }

  }

  public static parseMany (params: {
    rawMarkets: IBitmexMarketsSchema[],
  }): IAlunaMarketParseManyReturns {

    const { rawMarkets } = params

    let requestCount = 0

    const parsedMarkets = map(rawMarkets, (rawMarket) => {

      const {
        market: parsedMarket,
        requestCount: parseCount,
      } = this.parse({ rawMarket })

      requestCount += parseCount

      return parsedMarket

    })

    BitmexLog.info(`parsed ${parsedMarkets.length} markets for Bitmex`)

    return {
      markets: parsedMarkets,
      requestCount,
    }

  }

}
