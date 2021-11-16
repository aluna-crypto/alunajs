import { IMarketWithCurrency } from '../../modules/ValrMarketModule'
import {
  IValrCurrencyPairs,
  IValrMarketSchema,
} from '../IValrMarketSchema'



export class ValrCurrencyPairsParser {

  static parse (params: {
    rawMarkets: IValrMarketSchema[],
    rawCurrencyPairs: IValrCurrencyPairs[],
  }): IMarketWithCurrency[] {

    const {
      rawMarkets,
      rawCurrencyPairs,
    } = params

    const pairSymbolsDictionary: { [key:string]: IValrCurrencyPairs } = {}

    rawCurrencyPairs.forEach((pair) => {

      const { symbol } = pair

      pairSymbolsDictionary[symbol] = pair

    })

    const rawMarketsWithCurrency = rawMarkets.reduce((cumulator, current) => {

      const { currencyPair } = current

      const rawSymbol = pairSymbolsDictionary[currencyPair]

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
