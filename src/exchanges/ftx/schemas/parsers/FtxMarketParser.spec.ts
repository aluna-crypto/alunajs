import { expect } from 'chai'

import { Ftx } from '../../Ftx'
import { FTX_RAW_MARKETS } from '../../test/fixtures/ftxMarket'
import { FtxMarketParser } from './FtxMarketParser'



describe('FtxMarketParser', () => {


  it('should parse Ftx market just fine', async () => {

    const rawMarket = FTX_RAW_MARKETS[0]

    const parsedMarket = FtxMarketParser.parse({
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
      quoteVolume,
    } = ticker

    expect(exchangeId).to.be.eq(Ftx.ID)
    expect(symbolPair).to.be.eq(rawMarket.name)
    expect(baseSymbolId).to.be.eq(rawMarket.baseCurrency)
    expect(quoteSymbolId).to.be.eq(rawMarket.quoteCurrency)

    expect(high).to.be.eq(rawMarket.price)
    expect(low).to.be.eq(rawMarket.price)
    expect(bid).to.be.eq(rawMarket.bid)
    expect(ask).to.be.eq(rawMarket.ask)
    expect(last).to.be.eq(rawMarket.last)
    expect(change).to.be.eq(rawMarket.change24h)
    expect(baseVolume).to.be.eq(0)
    expect(quoteVolume).to.be.eq(rawMarket.quoteVolume24h)
    expect(date).to.be.ok

    expect(spotEnabled).to.be.ok
    expect(marginEnabled).not.to.be.ok
    expect(derivativesEnabled).not.to.be.ok
    expect(instrument).not.to.be.ok
    expect(leverageEnabled).not.to.be.ok
    expect(maxLeverage).not.to.be.ok

  })

  it('should parse Ftx market just fine with USD base Currency', async () => {

    const rawMarket = FTX_RAW_MARKETS[0]

    rawMarket.baseCurrency = 'USD'

    const parsedMarket = FtxMarketParser.parse({
      rawMarket,
    })

    const {
      baseSymbolId,
      ticker,
    } = parsedMarket

    const {
      baseVolume,
    } = ticker

    expect(baseSymbolId).to.be.eq('USD')

    expect(baseVolume).to.be.eq(rawMarket.volumeUsd24h)

  })

})
