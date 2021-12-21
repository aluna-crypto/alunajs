import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import {
  IMarketWithCurrencies,
  IValrCurrencyPairs,
  IValrMarketSchema,
} from '../schemas/IValrMarketSchema'
import { ValrCurrencyPairsParser } from '../schemas/parsers/ValrCurrencyPairsParser'
import { ValrMarketParser } from '../schemas/parsers/ValrMarketParser'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



interface IValrMarketModule extends IAlunaMarketModule {
  fetchMarkets (): Promise<IValrMarketSchema[]>
  fetchCurrencyPairs (): Promise<IValrCurrencyPairs[]>
}

export const ValrMarketModule: IValrMarketModule = class {

  public static async listRaw (): Promise<IMarketWithCurrencies[]> {

    ValrLog.info('fetching Valr markets')

    const rawMarkets = await this.fetchMarkets()

    ValrLog.info('fetching Valr currency pairs')

    const rawCurrencyPairs = await this.fetchCurrencyPairs()

    const rawMarketsWithCurrency = ValrCurrencyPairsParser.parse({
      rawMarkets,
      rawCurrencyPairs,
    })

    return rawMarketsWithCurrency

  }

  public static async list (): Promise<IAlunaMarketSchema[]> {

    const rawMarkets = await ValrMarketModule.listRaw()

    const parsedMarkets = ValrMarketModule.parseMany({ rawMarkets })

    return parsedMarkets

  }

  public static parse (params: {
    rawMarket: IMarketWithCurrencies,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const parsedMarket = ValrMarketParser.parse({ rawMarket })

    return parsedMarket

  }

  public static parseMany (params: {
    rawMarkets: IMarketWithCurrencies[],
  }): IAlunaMarketSchema[] {

    const { rawMarkets } = params

    const parsedMarkets = rawMarkets.map((rawMarket) => {

      const parsedMarket = ValrMarketParser.parse({ rawMarket })

      return parsedMarket

    })

    ValrLog.info(`parsed ${parsedMarkets.length} markets for Valr`)

    return parsedMarkets

  }

  public static async fetchMarkets (): Promise<IValrMarketSchema[]> {

    const markets = await ValrHttp.publicRequest<IValrMarketSchema[]>({
      url: 'https://api.valr.com/v1/public/marketsummary',
    })

    return markets

  }

  public static async fetchCurrencyPairs (): Promise<IValrCurrencyPairs[]> {

    const currencyPairs = await ValrHttp.publicRequest<IValrCurrencyPairs[]>({
      url: 'https://api.valr.com/v1/public/marketsummary',
    })

    return currencyPairs

  }

}
