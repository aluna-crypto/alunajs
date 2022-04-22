import {
  IValrCurrencyPairs,
  IValrMarketSchema,
  IValrMarketWithCurrencies,
} from '../IValrMarketSchema'



export class ValrCurrencyPairsParser {

  static parse (params: {
    rawMarkets: IValrMarketSchema[],
    rawCurrencyPairs: IValrCurrencyPairs[],
  }): IValrMarketWithCurrencies[] {

    const {
      rawMarkets,
      rawCurrencyPairs,
    } = params

    const symbolPairsDictionary: { [key:string]: IValrCurrencyPairs } = {}

    rawCurrencyPairs.forEach((pair) => {

      const { symbol } = pair

      symbolPairsDictionary[symbol] = pair

    })

    const rawMarketsWithCurrency = rawMarkets.reduce((cumulator, current) => {

      const { currencyPair } = current

      const rawSymbol = symbolPairsDictionary[currencyPair]

      if (rawSymbol) {

        const {
          baseCurrency,
          quoteCurrency,
        } = rawSymbol

        if (rawSymbol.active) {

          cumulator.push({
            ...current,
            baseCurrency,
            quoteCurrency,
          })

        }

      }

      return cumulator

    }, [] as IValrMarketWithCurrencies[])

    return rawMarketsWithCurrency

  }

}
