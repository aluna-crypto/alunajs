import { IValrCurrencyPairs } from '../IValrCurrencyPairs'
import { IValrMarketSchema } from '../IValrMarketSchema'
import { IMarketWithCurrency } from '../../../modules/ValrMarketModule'



export class ValrCurrencyPairsParser {

  static parse (params: {
    rawMarkets: IValrMarketSchema[],
    rawSymbolPairs: IValrCurrencyPairs[],
  }): IMarketWithCurrency[] {

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

    return rawMarketsWithCurrency

  }

}
