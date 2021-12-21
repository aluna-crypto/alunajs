import {
  IMarketWithCurrencies,
  IValrCurrencyPairs,
  IValrMarketSchema,
} from '../IValrMarketSchema'



export class ValrCurrencyPairsParser {

  static parse (params: {
    rawMarkets: IValrMarketSchema[],
    rawCurrencyPairs: IValrCurrencyPairs[],
  }): IMarketWithCurrencies[] {

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

        cumulator.push({
          ...current,
          baseCurrency,
          quoteCurrency,
        })

      }

      return cumulator

    }, [] as IMarketWithCurrencies[])

    return rawMarketsWithCurrency

  }

}
