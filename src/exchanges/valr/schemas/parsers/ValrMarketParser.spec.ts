import { expect } from 'chai'

import { VALR_RAW_MARKETS_WITH_CURRENCY } from '../../test/fixtures/valrMarket'
import { Valr } from '../../Valr'
import { ValrMarketParser } from './ValrMarketParser'



describe('ValrMarketParser', () => {

  it('should parse Valr market just fine', async () => {

    const rawMarket = VALR_RAW_MARKETS_WITH_CURRENCY[0]

    const parsedMarket = ValrMarketParser.parse({
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

    expect(exchangeId).to.be.eq(Valr.ID)
    expect(symbolPair).to.be.eq(rawMarket.currencyPair)
    expect(baseSymbolId).to.be.eq(rawMarket.baseCurrency)
    expect(quoteSymbolId).to.be.eq(rawMarket.quoteCurrency)

    expect(high).to.be.eq(parseFloat(rawMarket.highPrice))
    expect(low).to.be.eq(parseFloat(rawMarket.lowPrice))
    expect(bid).to.be.eq(parseFloat(rawMarket.bidPrice))
    expect(ask).to.be.eq(parseFloat(rawMarket.askPrice))
    expect(last).to.be.eq(parseFloat(rawMarket.lastTradedPrice))
    expect(change).to.be.eq(parseFloat(rawMarket.changeFromPrevious) / 100)
    expect(baseVolume).to.be.eq(parseFloat(rawMarket.baseVolume))
    expect(date).to.be.ok

    expect(spotEnabled).not.to.be.ok
    expect(marginEnabled).not.to.be.ok
    expect(derivativesEnabled).not.to.be.ok
    expect(instrument).not.to.be.ok
    expect(leverageEnabled).not.to.be.ok
    expect(maxLeverage).not.to.be.ok

  })

})
