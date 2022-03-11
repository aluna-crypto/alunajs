import { forOwn } from 'lodash'

import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { PoloniexHttp } from '../PoloniexHttp'
import { PoloniexLog } from '../PoloniexLog'
import { PROD_POLONIEX_URL } from '../PoloniexSpecs'
import {
  IPoloniexMarketSchema,
  IPoloniexMarketWithCurrency,
} from '../schemas/IPoloniexMarketSchema'
import { PoloniexMarketParser } from '../schemas/parsers/PoloniexMarketParser'



export const PoloniexMarketModule: IAlunaMarketModule = class {

  public static async listRaw (): Promise<IPoloniexMarketSchema> {

    const { publicRequest } = PoloniexHttp

    PoloniexLog.info('fetching Poloniex markets')

    const query = new URLSearchParams()

    query.append('command', 'returnTicker')

    const rawMarkets = await publicRequest<IPoloniexMarketSchema>({
      url: `${PROD_POLONIEX_URL}/public?${query.toString()}`,
    })

    return rawMarkets

  }



  public static async list (): Promise<IAlunaMarketSchema[]> {

    const rawMarkets = await PoloniexMarketModule.listRaw()

    const parsedMarkets = PoloniexMarketModule.parseMany({ rawMarkets })

    return parsedMarkets

  }



  public static parse (params: {
    rawMarket: IPoloniexMarketWithCurrency,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const parsedMarket = PoloniexMarketParser.parse({ rawMarket })

    return parsedMarket

  }



  public static parseMany (params: {
    rawMarkets: IPoloniexMarketSchema,
  }): IAlunaMarketSchema[] {

    const { rawMarkets } = params

    const parsedMarkets: IAlunaMarketSchema[] = []

    forOwn(rawMarkets, (value, key) => {

      const [quoteCurrency, baseCurrency] = key.split('_')

      const rawMarket: IPoloniexMarketWithCurrency = {
        currencyPair: key,
        baseCurrency,
        quoteCurrency,
        ...value,
      }

      const parsedMarket = PoloniexMarketModule.parse({ rawMarket })

      parsedMarkets.push(parsedMarket)

    })

    PoloniexLog.info(`parsed ${parsedMarkets.length} markets for Poloniex`)

    return parsedMarkets

  }

}
