import {
  IBinanceMarketSchema,
  IBinanceMarketWithCurrency,
} from '../IBinanceMarketSchema'
import { IBinanceSymbolInfoSchema } from '../IBinanceSymbolSchema'



export class BinanceMarketParser {

  static parse (params: {
    rawMarkets: IBinanceMarketSchema[],
    rawSymbols: IBinanceSymbolInfoSchema[],
  }): IBinanceMarketWithCurrency[] {

    const {
      rawMarkets,
      rawSymbols,
    } = params

    const pairSymbolsDictionary: { [key:string]: IBinanceSymbolInfoSchema } = {}

    rawSymbols.forEach((pair) => {

      const { symbol } = pair

      pairSymbolsDictionary[symbol] = pair

    })

    const rawMarketsWithCurrency = rawMarkets.reduce((cumulator, current) => {

      const { symbol } = current

      const rawSymbol = pairSymbolsDictionary[symbol]

      if (rawSymbol) {

        const {
          baseAsset,
          quoteAsset
        } = rawSymbol

        cumulator.push({
          ...current,
          baseCurrency: baseAsset,
          quoteCurrency: quoteAsset
        })

      }

      return cumulator

    }, [] as IBinanceMarketWithCurrency[])

    return rawMarketsWithCurrency

  }

}
