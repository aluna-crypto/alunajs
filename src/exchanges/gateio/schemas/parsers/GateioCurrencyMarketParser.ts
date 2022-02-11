import {
  IGateioMarketSchema,
  IGateioMarketWithCurrency,
} from '../IGateioMarketSchema'
import { IGateioSymbolSchema } from '../IGateioSymbolSchema'



export class GateioCurrencyMarketParser {

  static parse (params: {
      rawMarkets: IGateioMarketSchema[],
      rawSymbols: IGateioSymbolSchema[],
    }): IGateioMarketWithCurrency[] {

    const {
      rawMarkets,
      rawSymbols,
    } = params

    const pairSymbolsDictionary: { [key:string]: IGateioSymbolSchema } = {}

    rawSymbols.forEach((pair) => {

      const { id: symbol } = pair

      pairSymbolsDictionary[symbol] = pair

    })

    const rawMarketsWithCurrency = rawMarkets
      .reduce<IGateioMarketWithCurrency[]>((cumulator, current) => {

        const { currency_pair } = current

        const rawSymbol = pairSymbolsDictionary[currency_pair]

        if (rawSymbol) {

          const {
            base,
            quote,
          } = rawSymbol

          cumulator.push({
            ...current,
            baseCurrency: base,
            quoteCurrency: quote,
          })

        }

        return cumulator

      }, [])

    return rawMarketsWithCurrency

  }

}
