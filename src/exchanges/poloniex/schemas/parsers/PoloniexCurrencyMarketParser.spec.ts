import { expect } from 'chai'

import { POLONIEX_RAW_MARKET } from '../../test/fixtures/poloniexMarket'
import { PoloniexCurrencyMarketParser } from './PoloniexCurrencyMarketParser'



describe('PoloniexCurrencyMarketParser', () => {

  it('should parse Poloniex currency pairs just fine', () => {

    const rawMarkets = POLONIEX_RAW_MARKET
    const rawMarketSymbols = Object.keys(rawMarkets)

    const marketWithTicker = PoloniexCurrencyMarketParser.parse({
      rawMarkets,
    })


    expect(rawMarketSymbols.length).to.be.eq(3)

    marketWithTicker.forEach((item, index) => {

      const {
        baseCurrency,
        baseVolume,
        currencyPair,
        high24hr,
        highestBid,
        id,
        isFrozen,
        last,
        low24hr,
        lowestAsk,
        marginTradingEnabled,
        percentChange,
        postOnly,
        quoteCurrency,
        quoteVolume,
      } = item

      const currentMarketSymbol = rawMarketSymbols[index]
      const splittedMarketSymbol = currentMarketSymbol.split('_')
      const baseSymbolId = splittedMarketSymbol[0]
      const quoteSymbolId = splittedMarketSymbol[1]

      expect(baseCurrency).to.be.eq(baseSymbolId)
      expect(currencyPair).to.be.eq(currentMarketSymbol)
      expect(quoteCurrency)
        .to.be.eq(quoteSymbolId)
      expect(quoteVolume).to.be.eq(rawMarkets[currentMarketSymbol].quoteVolume)
      expect(id).to.be.eq(rawMarkets[currentMarketSymbol].id)
      expect(highestBid).to.be.eq(rawMarkets[currentMarketSymbol].highestBid)
      expect(isFrozen).to.be.eq(
        rawMarkets[currentMarketSymbol].isFrozen,
      )
      expect(last).to.be.eq(rawMarkets[currentMarketSymbol].last)
      expect(lowestAsk).to.be.eq(rawMarkets[currentMarketSymbol].lowestAsk)
      expect(marginTradingEnabled).to.be.eq(
        rawMarkets[currentMarketSymbol].marginTradingEnabled,
      )
      expect(postOnly).to.be.eq(rawMarkets[currentMarketSymbol].postOnly)
      expect(high24hr).to.be.eq(rawMarkets[currentMarketSymbol].high24hr)
      expect(low24hr).to.be.eq(rawMarkets[currentMarketSymbol].low24hr)
      expect(percentChange).to.be.eq(
        rawMarkets[currentMarketSymbol].percentChange,
      )
      expect(baseVolume).to.be.eq(rawMarkets[currentMarketSymbol].baseVolume)

    })

  })

})
