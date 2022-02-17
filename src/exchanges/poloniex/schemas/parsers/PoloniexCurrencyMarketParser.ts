import {
  IPoloniexMarketSchema,
  IPoloniexMarketWithCurrency,
} from '../IPoloniexMarketSchema'



export class PoloniexCurrencyMarketParser {

  static parse (params: {
        rawMarkets: IPoloniexMarketSchema,
      }): IPoloniexMarketWithCurrency[] {

    const {
      rawMarkets,
    } = params

    const currencies = Object.keys(rawMarkets)

    const rawMarketsWithCurrency = currencies
      .reduce<IPoloniexMarketWithCurrency[]>((cumulator, current) => {

        const rawTicker = rawMarkets[current]


        const splittedMarketSymbol = current.split('_')
        const baseCurrency = splittedMarketSymbol[0]
        const quoteCurrency = splittedMarketSymbol[1]

        cumulator.push({
          currencyPair: current,
          baseCurrency,
          quoteCurrency,
          ...rawTicker,
        })

        return cumulator

      }, [])

    return rawMarketsWithCurrency

  }

}

