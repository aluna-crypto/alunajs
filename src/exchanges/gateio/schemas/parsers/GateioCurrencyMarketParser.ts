import {
  IGateioMarketSchema,
  IGateioMarketWithCurrency,
} from '../IGateioMarketSchema'



export class GateioCurrencyMarketParser {

  static parse (params: {
      rawMarkets: IGateioMarketSchema[],
    }): IGateioMarketWithCurrency[] {

    const {
      rawMarkets,
    } = params

    const rawMarketsWithCurrency = rawMarkets
      .reduce<IGateioMarketWithCurrency[]>((cumulator, current) => {

        const { currency_pair } = current

        const splittedCurrencyPair = currency_pair.split('_')
        const baseCurrency = splittedCurrencyPair[0]
        const quoteCurrency = splittedCurrencyPair[1]

        cumulator.push({
          ...current,
          baseCurrency,
          quoteCurrency,
        })

        return cumulator

      }, [])

    return rawMarketsWithCurrency

  }

}
