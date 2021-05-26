import { IValrCurrencyPairs } from '../../../schemas/IValrCurrencyPairs'
import { IValrMarketSchema } from '../../../schemas/IValrMarketSchema'
import { IMarketWithCurrency } from '../ValrMarket'



interface IValrCurrencyPairsParseResponse {
  rawMarketsWithCurrency: IMarketWithCurrency[]
  currencyVolumes: Record<string, string>
}



export class ValrCurrencyPairsParser {

  static parse (params: {
    rawMarkets: IValrMarketSchema[]
    rawSymbolPairs: IValrCurrencyPairs[]
  }): IValrCurrencyPairsParseResponse {

    const currencyVolumes = {} as Record<string, string>

    const rawMarketsWithCurrency = params.rawMarkets
      .reduce((cumulator, current) => {

        const rawSymbol = params.rawSymbolPairs.find(
          (eachItem) => eachItem.symbol === current.currencyPair,
        )

        if (rawSymbol) {

          const {
            baseCurrency,
            quoteCurrency,
          } = rawSymbol

          currencyVolumes[baseCurrency] = current.baseVolume

          cumulator.push({
            ...current,
            baseCurrency,
            quoteCurrency,
          })

        }

        return cumulator

      }, [] as IMarketWithCurrency[])

    return {
      rawMarketsWithCurrency,
      currencyVolumes,
    }

  }

}
