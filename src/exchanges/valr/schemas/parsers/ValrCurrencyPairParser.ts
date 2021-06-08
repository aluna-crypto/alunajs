import { IMarketWithCurrency } from '../../modules/ValrMarketModule'
import { IValrCurrencyPairs } from '../IValrCurrencyPairs'
import { IValrMarketSchema } from '../IValrMarketSchema'



export class ValrCurrencyPairsParser {

  static parse (params: {
    rawMarkets: IValrMarketSchema[],
    rawCurrencyPairs: IValrCurrencyPairs[],
  }): IMarketWithCurrency[] {

    const rawMarketsWithCurrency = params.rawMarkets
      .reduce((cumulator, current) => {

        const rawSymbol = params.rawCurrencyPairs.find(
          (eachItem) => eachItem.symbol === current.currencyPair,
        )

        if (rawSymbol) {

          const {
            baseCurrency,
            quoteCurrency,
          } = rawSymbol

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
