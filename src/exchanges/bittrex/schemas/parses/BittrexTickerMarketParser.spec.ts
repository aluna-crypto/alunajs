import { expect } from 'chai'

import {
  BITTREX_RAW_MARKET_SUMMARIES,
  BITTREX_RAW_MARKET_TICKERS,
} from '../../test/fixtures/bittrexMarket'
import { BittrexTickerMarketParser } from './BittrexTickerMarketParser'



describe('BittrexTickerMarketParser', () => {

  it('should parse Bittrex currency pairs just fine', () => {

    const rawMarketSummaries = BITTREX_RAW_MARKET_SUMMARIES
    const rawMarketTickers = BITTREX_RAW_MARKET_TICKERS

    const marketWithTicker = BittrexTickerMarketParser.parse({
      rawMarketSummaries,
      rawMarketTickers,
    })

    expect(rawMarketSummaries.length).to.be.eq(4)
    expect(rawMarketTickers.length).to.be.eq(3)
    expect(marketWithTicker.length).to.be.eq(3)

    marketWithTicker.forEach((item, index) => {

      const {
        baseCurrencySymbol,
        quoteCurrencySymbol,
        askRate,
        bidRate,
        high,
        lastTradeRate,
        low,
        percentChange,
        quoteVolume,
        symbol,
        volume,
      } = item

      const splittedMarketSymbol = rawMarketSummaries[index].symbol.split('-')
      const baseSymbolId = splittedMarketSymbol[0]
      const quoteSymbolId = splittedMarketSymbol[1]

      expect(baseCurrencySymbol).to.be.eq(baseSymbolId)
      expect(symbol).to.be.eq(rawMarketSummaries[index].symbol)
      expect(quoteCurrencySymbol)
        .to.be.eq(quoteSymbolId)
      expect(quoteVolume).to.be.eq(rawMarketSummaries[index].quoteVolume)
      expect(high).to.be.eq(rawMarketSummaries[index].high)
      expect(low).to.be.eq(rawMarketSummaries[index].low)
      expect(percentChange).to.be.eq(rawMarketSummaries[index].percentChange)
      expect(volume).to.be.eq(rawMarketSummaries[index].volume)

      expect(askRate).to.be.eq(rawMarketTickers[index].askRate)
      expect(bidRate).to.be.eq(rawMarketTickers[index].bidRate)
      expect(lastTradeRate).to.be.eq(rawMarketTickers[index].lastTradeRate)

    })

  })

})
