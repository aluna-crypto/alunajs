import { AAlunaModule } from '@lib/abstracts/AAlunaModule'
import { IAlunaMarketModule } from '@lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '@lib/schemas/IAlunaMarketSchema'

import { IValrCurrencyPairs } from '../schemas/IValrCurrencyPairs'
import { IValrMarketSchema } from '../schemas/IValrMarketSchema'
import { ValrRequest } from '../ValrRequest'
import { ValrCurrencyPairsParser } from './parsers/ValrCurrencyPairParser'
import { ValrMarketParser } from './parsers/ValrMarketParser'



export interface IMarketWithCurrency extends IValrMarketSchema {
  baseCurrency: string
  quoteCurrency: string
}



export class ValrMarketModule
  extends AAlunaModule implements IAlunaMarketModule {

  async listRaw (): Promise<IMarketWithCurrency[]> {


    const request = new ValrRequest()

    const rawMarkets = await request.get<IValrMarketSchema[]>({
      url: 'https://api.valr.com/v1/public/marketsummary',
    })

    const rawSymbolPairs = await request.get<IValrCurrencyPairs[]>({
      url: 'https://api.valr.com/v1/public/pairs',
    })


    const rawMarketsWithCurrency = ValrCurrencyPairsParser.parse({
      rawMarkets,
      rawSymbolPairs,
    })

    return rawMarketsWithCurrency

  }

  async list (): Promise<IAlunaMarketSchema[]> {

    const request = new ValrRequest()

    const rawMarkets = await request.get<IValrMarketSchema[]>({
      url: 'https://api.valr.com/v1/public/marketsummary',
    })

    const rawSymbolPairs = await request.get<IValrCurrencyPairs[]>({
      url: 'https://api.valr.com/v1/public/pairs',
    })



    const rawMarketsWithCurrency = ValrCurrencyPairsParser.parse({
      rawMarkets,
      rawSymbolPairs,
    })

    return this.parseMany({
      rawMarkets: rawMarketsWithCurrency,
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
