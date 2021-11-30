import {
  IBinanceMarketSchema,
  IBinanceMarketWithCurrency,
} from '../IBinanceMarketSchema'
import { IBinanceSymbolSchema } from '../IBinanceSymbolSchema'



export class BinanceCurrencyMarketParser {

  static parse (params: {
    rawMarkets: IBinanceMarketSchema[],
    rawSymbols: IBinanceSymbolSchema[],
  }): IBinanceMarketWithCurrency[] {

    const {
      rawMarkets,
      rawSymbols,
    } = params

    const pairSymbolsDictionary: { [key:string]: IBinanceSymbolSchema } = {}

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
          quoteAsset,
          isSpotTradingAllowed,
          isMarginTradingAllowed,
        } = rawSymbol

        cumulator.push({
          ...current,
          baseCurrency: baseAsset,
          quoteCurrency: quoteAsset,
          marginEnabled: isMarginTradingAllowed,
          spotEnabled: isSpotTradingAllowed,
        })

      }

      return cumulator

    }, [] as IBinanceMarketWithCurrency[])

    return rawMarketsWithCurrency

  }

}
