import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { IValrCurrencyPairs } from '../schemas/IValrCurrencyPairs'
import { IValrMarketSchema } from '../schemas/IValrMarketSchema'
import { ValrCurrencyPairsParser } from '../schemas/parsers/ValrCurrencyPairParser'
import { ValrMarketParser } from '../schemas/parsers/ValrMarketParser'
import { ValrHttp } from '../ValrHttp'



export interface IMarketWithCurrency extends IValrMarketSchema {
  baseCurrency: string
  quoteCurrency: string
}



export const ValrMarketModule: IAlunaMarketModule = class {

  static async listRaw (): Promise<IMarketWithCurrency[]> {

    const { publicRequest } = ValrHttp

    const rawMarkets = await publicRequest<IValrMarketSchema[]>({
      url: 'https://api.valr.com/v1/public/marketsummary',
    })

    const rawCurrencyPairs = await publicRequest<IValrCurrencyPairs[]>({
      url: 'https://api.valr.com/v1/public/pairs',
    })

    const rawMarketsWithCurrency = ValrCurrencyPairsParser.parse({
      rawMarkets,
      rawCurrencyPairs,
    })

    return rawMarketsWithCurrency

  }

  static async list (): Promise<IAlunaMarketSchema[]> {

    return ValrMarketModule.parseMany({
      rawMarkets: await ValrMarketModule.listRaw(),
    })

  }

  static parse (params: {
    rawMarket: IMarketWithCurrency,
  }): IAlunaMarketSchema {

    return ValrMarketParser.parse(params)

  }

  static parseMany (params: {
    rawMarkets: IMarketWithCurrency[],
  }): IAlunaMarketSchema[] {

    return params.rawMarkets.map((rawMarket) => ValrMarketModule.parse({
      rawMarket,
    }))

  }

}
