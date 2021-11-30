import { expect } from 'chai'

import {
  BINANCE_RAW_MARKET,
  BINANCE_RAW_MARKETS,
} from '../../test/fixtures/binanceMarket'
import { BINANCE_RAW_SYMBOLS } from '../../test/fixtures/binanceSymbols'
import { BinanceCurrencyMarketParser } from './BinanceCurrencyMarketParser'



describe('BinanceCurrencyMarketParser', () => {

  it('should parse Binance currency pairs just fine', () => {

    const rawMarkets = [...BINANCE_RAW_MARKETS, BINANCE_RAW_MARKET]
    const rawSymbols = BINANCE_RAW_SYMBOLS.symbols

    const marketWithCurr = BinanceCurrencyMarketParser.parse({
      rawMarkets,
      rawSymbols,
    })

    expect(rawMarkets.length).to.be.eq(4)

    expect(rawSymbols.length).to.be.eq(3)

    expect(marketWithCurr.length).to.be.eq(3)

    marketWithCurr.forEach((item, index) => {

      const {
        askPrice,
        baseCurrency,
        askQty,
        bidQty,
        closeTime,
        count,
        firstId,
        lastId,
        lastPrice,
        lastQty,
        openPrice,
        openTime,
        prevClosePrice,
        priceChange,
        priceChangePercent,
        quoteVolume,
        symbol,
        volume,
        weightedAvgPrice,
        bidPrice,
        highPrice,
        lowPrice,
        quoteCurrency,
      } = item

      expect(prevClosePrice).to.be.eq(rawMarkets[index].prevClosePrice)
      expect(priceChange).to.be.eq(rawMarkets[index].priceChange)
      expect(priceChangePercent).to.be.eq(rawMarkets[index].priceChangePercent)
      expect(quoteVolume).to.be.eq(rawMarkets[index].quoteVolume)
      expect(volume).to.be.eq(rawMarkets[index].volume)
      expect(weightedAvgPrice).to.be.eq(rawMarkets[index].weightedAvgPrice)
      expect(symbol).to.be.eq(rawMarkets[index].symbol)
      expect(askPrice).to.be.eq(rawMarkets[index].askPrice)
      expect(bidPrice).to.be.eq(rawMarkets[index].bidPrice)
      expect(askQty).to.be.eq(rawMarkets[index].askQty)
      expect(bidQty).to.be.eq(rawMarkets[index].bidQty)
      expect(closeTime).to.be.eq(rawMarkets[index].closeTime)
      expect(highPrice).to.be.eq(rawMarkets[index].highPrice)
      expect(lowPrice).to.be.eq(rawMarkets[index].lowPrice)
      expect(count).to.be.eq(rawMarkets[index].count)
      expect(firstId).to.be.eq(rawMarkets[index].firstId)
      expect(lastId).to.be.eq(rawMarkets[index].lastId)
      expect(lastPrice).to.be.eq(rawMarkets[index].lastPrice)
      expect(lastQty).to.be.eq(rawMarkets[index].lastQty)
      expect(openPrice).to.be.eq(rawMarkets[index].openPrice)
      expect(openTime).to.be.eq(rawMarkets[index].openTime)

      expect(baseCurrency).to.be.ok
      expect(quoteCurrency).to.be.ok
      expect(`${baseCurrency}${quoteCurrency}`)
        .to.be.eq(rawMarkets[index].symbol)

    })

  })

})
