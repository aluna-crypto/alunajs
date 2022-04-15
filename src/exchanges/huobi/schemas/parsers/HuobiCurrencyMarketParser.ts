import {
  IHuobiMarketSchema,
  IHuobiMarketWithCurrency,
} from '../IHuobiMarketSchema'
import { IHuobiSymbolSchema } from '../IHuobiSymbolSchema'



export class HuobiCurrencyMarketParser {

  static parse (params: {
    rawMarkets: IHuobiMarketSchema[],
    rawSymbols: IHuobiSymbolSchema[],
  }): IHuobiMarketWithCurrency[] {

    const {
      rawMarkets,
      rawSymbols,
    } = params

    const pairSymbolsDictionary: { [key:string]: IHuobiSymbolSchema } = {}

    rawSymbols.forEach((pair) => {

      const { symbol } = pair

      pairSymbolsDictionary[symbol] = pair

    })

    const rawMarketsWithCurrency = rawMarkets
      .reduce<IHuobiMarketWithCurrency[]>((cumulator, current) => {

        const { symbol } = current

        const rawSymbol = pairSymbolsDictionary[symbol]

        if (rawSymbol) {

          const {
            bc: baseCurrency,
            qc: quoteCurrency,
          } = rawSymbol

          cumulator.push({
            ...current,
            baseCurrency,
            quoteCurrency,
          })

        }

        return cumulator

      }, [])

    return rawMarketsWithCurrency

  }

}
