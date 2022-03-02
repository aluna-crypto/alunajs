import { expect } from 'chai'

import { Poloniex } from '../../Poloniex'
import { POLONIEX_RAW_MARKETS_WITH_CURRENCY } from '../../test/fixtures/poloniexMarket'
import { PoloniexMarketParser } from './PoloniexMarketParser'



describe('PoloniexMarketParser', () => {


  it('should parse Poloniex market just fine', async () => {

    const rawMarket = POLONIEX_RAW_MARKETS_WITH_CURRENCY[0]

    const parsedMarket = PoloniexMarketParser.parse({
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

    expect(exchangeId).to.be.eq(Poloniex.ID)
    expect(symbolPair).to.be.eq(rawMarket.currencyPair)
    expect(baseSymbolId).to.be.eq(rawMarket.baseCurrency)
    expect(quoteSymbolId).to.be.eq(rawMarket.quoteCurrency)

    expect(high).to.be.eq(parseFloat(rawMarket.high24hr))
    expect(low).to.be.eq(parseFloat(rawMarket.low24hr))
    expect(bid).to.be.eq(parseFloat(rawMarket.highestBid))
    expect(ask).to.be.eq(parseFloat(rawMarket.lowestAsk))
    expect(last).to.be.eq(parseFloat(rawMarket.last))
    expect(change).to.be.eq(parseFloat(rawMarket.percentChange))
    expect(baseVolume).to.be.eq(parseFloat(rawMarket.baseVolume))
    expect(date).to.be.ok

    expect(spotEnabled).to.be.ok
    expect(marginEnabled).not.to.be.ok
    expect(derivativesEnabled).not.to.be.ok
    expect(instrument).not.to.be.ok
    expect(leverageEnabled).not.to.be.ok
    expect(maxLeverage).not.to.be.ok

  })

})
