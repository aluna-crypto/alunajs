import { map } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { IBitmexMarketsSchema } from '../schemas/IBitmexMarketsSchema'
import { BitmexMarketParser } from '../schemas/parsers/BitmexMarketParser'
import { BitmexSymbolModule } from './BitmexSymbolModule'



export const BitmexMarketModule: Required<IAlunaMarketModule> = class {


  public static async listRaw (): Promise<IBitmexMarketsSchema[]> {

    BitmexLog.info('fetching Bitmex markets')

    const rawMarkets = await BitmexSymbolModule.listRaw()

    return rawMarkets

  }

  public static async list (): Promise<IAlunaMarketSchema[]> {

    const rawMarkets = await BitmexMarketModule.listRaw()

    const parsedMarkets = BitmexMarketModule.parseMany({ rawMarkets })

    return parsedMarkets

  }

  public static async getRaw (params: {
    symbolPair: string,
  }): Promise<IBitmexMarketsSchema> {

    const { symbolPair } = params

    const { publicRequest } = BitmexHttp

    const requestResponse = await publicRequest<IBitmexMarketsSchema[]>({
      url: `${PROD_BITMEX_URL}/instrument?symbol=${symbolPair}`,
    })

    if (!requestResponse.length) {

      const alunaError = new AlunaError({
        code: AlunaGenericErrorCodes.NOT_FOUND,
        message: `No market found for: ${symbolPair}`,
      })

      BitmexLog.error(alunaError)

      throw alunaError

    }

    return requestResponse[0]

  }

  public static async get (params: {
      symbolPair: string,
    }): Promise<IAlunaMarketSchema> {

    const { symbolPair } = params

    const rawMarket = await this.getRaw({ symbolPair })

    const parsedMarket = this.parse({ rawMarket })

    return parsedMarket

  }

  public static parse (params: {
    rawMarket: IBitmexMarketsSchema,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const parsedMarket = BitmexMarketParser.parse({
      rawMarket,
    })

    return parsedMarket

  }

  public static parseMany (params: {
    rawMarkets: IBitmexMarketsSchema[],
  }): IAlunaMarketSchema[] {

    const { rawMarkets } = params

    const parsedMarkets = map(rawMarkets, (rawMarket) => {

      const parsedMarket = this.parse({ rawMarket })

      return parsedMarket

    })

    BitmexLog.info(`parsed ${parsedMarkets.length} markets for Bitmex`)

    return parsedMarkets

  }

}
