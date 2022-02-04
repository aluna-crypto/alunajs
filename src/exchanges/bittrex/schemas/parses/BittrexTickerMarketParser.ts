import {
  IBittrexMarketSchema,
  IBittrexMarketSummarySchema,
  IBittrexMarketTickerSchema,
  IBittrexMarketWithTicker,
} from '../IBittrexMarketSchema'



export class BittrexTickerMarketParser {

  static parse (params: {
      rawMarkets: IBittrexMarketSchema[],
      rawMarketSummaries: IBittrexMarketSummarySchema[],
      rawMarketTickers: IBittrexMarketTickerSchema[],
    }): IBittrexMarketWithTicker[] {

    const {
      rawMarketSummaries,
      rawMarketTickers,
      rawMarkets,
    } = params

    const marketSummaryDictionary:
        { [key:string]: IBittrexMarketSummarySchema } = {}

    rawMarketSummaries.forEach((pair) => {

      const { symbol } = pair

      marketSummaryDictionary[symbol] = pair

    })


    const marketTickerDictionary:
        { [key:string]: IBittrexMarketTickerSchema } = {}

    rawMarketTickers.forEach((pair) => {

      const { symbol } = pair

      marketTickerDictionary[symbol] = pair

    })

    const rawMarketsWithTicker = rawMarkets
      .reduce<IBittrexMarketWithTicker[]>((cumulator, current) => {

        const { symbol } = current

        const rawSummary = marketSummaryDictionary[symbol]

        const rawTicker = marketTickerDictionary[symbol]

        if (rawSummary && rawTicker) {

          const {
            high,
            low,
            percentChange,
            quoteVolume,
            volume,
          } = rawSummary

          const {
            askRate,
            bidRate,
            lastTradeRate,
          } = rawTicker

          cumulator.push({
            ...current,
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
