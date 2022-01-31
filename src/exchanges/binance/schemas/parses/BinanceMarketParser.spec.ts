import { expect } from 'chai'

import { Binance } from '../../Binance'
import { BINANCE_RAW_MARKETS_WITH_CURRENCY } from '../../test/fixtures/binanceMarket'
import { BinanceMarketParser } from './BinanceMarketParser'



describe('BinanceMarketParser', () => {


  it('should parse Binance market just fine', async () => {

    const rawMarket = BINANCE_RAW_MARKETS_WITH_CURRENCY[0]

    const parsedMarket = BinanceMarketParser.parse({
      rawMarket,
    })

    const {
      exchangeId,
      ticker,
      symbolPair,
      baseSymbolId,
      quoteSymbolId,
      spotEnabled,
      marginEnabled,
      derivativesEnabled,
      instrument,
      leverageEnabled,
      maxLeverage,
    } = parsedMarket

    const {
      high,
      low,
      bid,
      ask,
      last,
      change,
      date,
      baseVolume,
    } = ticker

    expect(exchangeId).to.be.eq(Binance.ID)
    expect(symbolPair).to.be.eq(rawMarket.symbol)
    expect(baseSymbolId).to.be.eq(rawMarket.baseCurrency)
    expect(quoteSymbolId).to.be.eq(rawMarket.quoteCurrency)

    expect(high).to.be.eq(parseFloat(rawMarket.highPrice))
    expect(low).to.be.eq(parseFloat(rawMarket.lowPrice))
    expect(bid).to.be.eq(parseFloat(rawMarket.bidPrice))
    expect(ask).to.be.eq(parseFloat(rawMarket.askPrice))
    expect(last).to.be.eq(parseFloat(rawMarket.lastPrice))
    expect(change).to.be.eq(parseFloat(rawMarket.priceChange) / 100)
    expect(baseVolume).to.be.eq(parseFloat(rawMarket.volume))
    expect(date).to.be.ok

    expect(spotEnabled).to.be.ok
    expect(marginEnabled).to.be.ok
    expect(derivativesEnabled).not.to.be.ok
    expect(instrument).not.to.be.ok
    expect(leverageEnabled).not.to.be.ok
    expect(maxLeverage).not.to.be.ok

  })

})
