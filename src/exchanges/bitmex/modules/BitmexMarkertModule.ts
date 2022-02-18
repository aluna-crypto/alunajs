import { map } from 'lodash'

import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { BitmexLog } from '../BitmexLog'
import { IBitmexMarketsSchema } from '../schemas/IBitmexMarketsSchema'
import { BitmexSymbolModule } from './BitmexSymbolModule'



export const BitmexMarketModule: IAlunaMarketModule = class {


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

  public static parse (params: {
    rawMarket: IBitmexMarketsSchema,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    return rawMarket as any

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
