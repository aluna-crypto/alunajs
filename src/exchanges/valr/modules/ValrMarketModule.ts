import { AAlunaModule } from '@lib/abstracts/AAlunaModule'
import { IAlunaMarketModule } from '@lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '@lib/schemas/IAlunaMarketSchema'

import { IValrCurrencyPairs } from '../lib/schemas/IValrCurrencyPairs'
import { IValrMarketSchema } from '../lib/schemas/IValrMarketSchema'
import { ValrCurrencyPairsParser } from '../lib/schemas/parsers/ValrCurrencyPairParser'
import { ValrMarketParser } from '../lib/schemas/parsers/ValrMarketParser'
import { ValrHttp } from '../lib/ValrHttp'



export interface IMarketWithCurrency extends IValrMarketSchema {
  baseCurrency: string
  quoteCurrency: string
}



export class ValrMarketModule extends AAlunaModule implements IAlunaMarketModule {

  async listRaw (): Promise<IMarketWithCurrency[]> {

    const { publicRequest } = ValrHttp

    const rawMarkets = await publicRequest<IValrMarketSchema[]>({
      url: 'https://api.valr.com/v1/public/marketsummary',
    })

    const rawSymbolPairs = await publicRequest<IValrCurrencyPairs[]>({
      url: 'https://api.valr.com/v1/public/pairs',
    })

    const rawMarketsWithCurrency = ValrCurrencyPairsParser.parse({
      rawMarkets,
      rawSymbolPairs,
    })

    return rawMarketsWithCurrency

  }

  async list (): Promise<IAlunaMarketSchema[]> {

    return this.parseMany({
      rawMarkets: await this.listRaw(),
    })

  }



  parse (params: {
    rawMarket: IMarketWithCurrency,
  }): IAlunaMarketSchema {

    return ValrMarketParser.parse(params)

  }



  parseMany (params: {
    rawMarkets: IMarketWithCurrency[],
  }): IAlunaMarketSchema[] {

    return params.rawMarkets.map((rawMarket) => this.parse({
      rawMarket,
    }))

  }

}
