import { expect } from 'chai'

import {
  BITTREX_RAW_MARKET,
  BITTREX_RAW_MARKET_SUMMARIES,
  BITTREX_RAW_MARKET_TICKERS,
  BITTREX_RAW_MARKETS,
} from '../../test/fixtures/bittrexMarket'
import { BittrexTickerMarketParser } from './BittrexTickerMarketParser'



describe('BittrexTickerMarketParser', () => {

  it('should parse Bittrex currency pairs just fine', () => {

    const rawMarkets = [...BITTREX_RAW_MARKETS, BITTREX_RAW_MARKET]
    const rawMarketSummaries = BITTREX_RAW_MARKET_SUMMARIES
    const rawMarketTickers = BITTREX_RAW_MARKET_TICKERS

    const marketWithTicker = BittrexTickerMarketParser.parse({
      rawMarkets,
      rawMarketSummaries,
      rawMarketTickers,
    })

    expect(rawMarkets.length).to.be.eq(4)
    expect(rawMarketSummaries.length).to.be.eq(3)
    expect(rawMarketTickers.length).to.be.eq(3)
    expect(marketWithTicker.length).to.be.eq(3)

    marketWithTicker.forEach((item, index) => {

      const {
        associatedTermsOfService,
        baseCurrencySymbol,
        createdAt,
        minTradeSize,
        precision,
        prohibitedIn,
        quoteCurrencySymbol,
        status,
        tags,
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

      expect(associatedTermsOfService)
        .to.be.eq(rawMarkets[index].associatedTermsOfService)
      expect(baseCurrencySymbol).to.be.eq(rawMarkets[index].baseCurrencySymbol)
      expect(createdAt).to.be.eq(rawMarkets[index].createdAt)
      expect(minTradeSize).to.be.eq(rawMarkets[index].minTradeSize)
      expect(symbol).to.be.eq(rawMarkets[index].symbol)
      expect(precision).to.be.eq(rawMarkets[index].precision)
      expect(prohibitedIn).to.be.eq(rawMarkets[index].prohibitedIn)
      expect(quoteCurrencySymbol)
        .to.be.eq(rawMarkets[index].quoteCurrencySymbol)
      expect(status).to.be.eq(rawMarkets[index].status)
      expect(tags).to.be.eq(rawMarkets[index].tags)

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
