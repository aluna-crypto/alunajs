import {
  IBittrexMarketSummarySchema,
  IBittrexMarketTickerSchema,
  IBittrexMarketWithTicker,
} from '../IBittrexMarketSchema'



export class BittrexTickerMarketParser {

  static parse (params: {
      rawMarketSummaries: IBittrexMarketSummarySchema[],
      rawMarketTickers: IBittrexMarketTickerSchema[],
    }): IBittrexMarketWithTicker[] {

    const {
      rawMarketSummaries,
      rawMarketTickers,
    } = params

    const marketTickerDictionary:
        { [key:string]: IBittrexMarketTickerSchema } = {}

    rawMarketTickers.forEach((pair) => {

      const { symbol } = pair

      marketTickerDictionary[symbol] = pair

    })

    const rawMarketsWithTicker = rawMarketSummaries
      .reduce<IBittrexMarketWithTicker[]>((cumulator, current) => {

        const { symbol } = current

        const rawTicker = marketTickerDictionary[symbol]

        if (rawTicker) {

          const {
            high,
            low,
            percentChange,
            quoteVolume,
            volume,
            symbol,
          } = current

          const splittedMarketSymbol = symbol.split('-')
          const baseCurrencySymbol = splittedMarketSymbol[0]
          const quoteCurrencySymbol = splittedMarketSymbol[1]

          const {
            askRate,
            bidRate,
            lastTradeRate,
          } = rawTicker

          cumulator.push({
            symbol,
            baseCurrencySymbol,
            quoteCurrencySymbol,
            high,
            low,
            percentChange,
            quoteVolume,
            volume,
            askRate,
            bidRate,
            lastTradeRate,
          })

        }

        return cumulator

      }, [])

    return rawMarketsWithTicker

  }

}
