import { AAlunaPublicModule } from '@lib/abstracts/AAlunaPublicModule'
import { IAlunaMarketModule } from '@lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '@lib/schemas/IAlunaMarketSchema'

import { IValrMarketSchema } from '../../schemas/IValrMarketSchema'
import { ValrCurrencyPairsParser } from './parsers/ValrCurrencyPairParser'
import { ValrMarketParser } from './parsers/ValrMarketParser'
import { ValrMarketList } from './ValrMarketList'



export interface IMarketWithCurrency extends IValrMarketSchema {
  baseCurrency: string
  quoteCurrency: string
}



export class ValrMarket extends AAlunaPublicModule implements IAlunaMarketModule {

  async list (): Promise<IAlunaMarketSchema[]> {

    const {
      rawMarkets,
      rawSymbolPairs,
    } = await new ValrMarketList({
      publicRequest: this.requestHandler,
    }).list()

    const {
      rawMarketsWithCurrency,
      currencyVolumes,
    } = ValrCurrencyPairsParser.parse({
      rawMarkets,
      rawSymbolPairs,
    })

    return this.parseMany({
      rawMarkets: rawMarketsWithCurrency,
      currencyVolumes,
    })

  }

  parse (params: {
    rawMarket: IMarketWithCurrency
    currencyVolumes: Record<string, string>
  }): IAlunaMarketSchema {

    return ValrMarketParser.parse(params)

  }

  parseMany (params: {
    rawMarkets: IMarketWithCurrency[]
    currencyVolumes: Record<string, string>
  }): IAlunaMarketSchema[] {

    return params.rawMarkets.map((rawMarket) => this.parse({
      rawMarket,
      currencyVolumes: params.currencyVolumes,
    }))

  }

}
