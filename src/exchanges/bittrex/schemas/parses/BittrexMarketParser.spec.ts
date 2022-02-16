import { expect } from 'chai'

import { Bittrex } from '../../Bittrex'
import { BITTREX_RAW_MARKETS_WITH_TICKER } from '../../test/fixtures/bittrexMarket'
import { BittrexMarketParser } from './BittrexMarketParser'



describe('BittrexMarketParser', () => {


  it('should parse Bittrex market just fine', async () => {

    const rawMarket = BITTREX_RAW_MARKETS_WITH_TICKER[0]

    const parsedMarket = BittrexMarketParser.parse({
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
      quoteVolume,
      low,
      bid,
      ask,
      last,
      change,
      date,
      baseVolume,
    } = ticker

    expect(exchangeId).to.be.eq(Bittrex.ID)
    expect(symbolPair).to.be.eq(rawMarket.symbol)
    expect(baseSymbolId).to.be.eq(rawMarket.baseCurrencySymbol)
    expect(quoteSymbolId).to.be.eq(rawMarket.quoteCurrencySymbol)

    expect(high).to.be.eq(parseFloat(rawMarket.high))
    expect(low).to.be.eq(parseFloat(rawMarket.low))
    expect(bid).to.be.eq(parseFloat(rawMarket.bidRate))
    expect(ask).to.be.eq(parseFloat(rawMarket.askRate))
    expect(last).to.be.eq(parseFloat(rawMarket.lastTradeRate))
    expect(change).to.be.eq(parseFloat(rawMarket.percentChange) / 100)
    expect(baseVolume).to.be.eq(parseFloat(rawMarket.volume))
    expect(quoteVolume).to.be.eq(parseFloat(rawMarket.quoteVolume))
    expect(date).to.be.ok

    expect(spotEnabled).to.be.ok
    expect(marginEnabled).to.not.be.ok
    expect(derivativesEnabled).not.to.be.ok
    expect(instrument).not.to.be.ok
    expect(leverageEnabled).not.to.be.ok
    expect(maxLeverage).not.to.be.ok

  })

})
