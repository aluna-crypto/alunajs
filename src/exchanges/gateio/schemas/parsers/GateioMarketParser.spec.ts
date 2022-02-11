import { expect } from 'chai'

import { Gateio } from '../../Gateio'
import { GATEIO_RAW_MARKETS_WITH_CURRENCY } from '../../test/fixtures/gateioMarket'
import { GateioMarketParser } from './GateioMarketParser'



describe('GateioMarketParser', () => {


  it('should parse Gateio market just fine', async () => {

    const rawMarket = GATEIO_RAW_MARKETS_WITH_CURRENCY[0]

    const parsedMarket = GateioMarketParser.parse({
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

    expect(exchangeId).to.be.eq(Gateio.ID)
    expect(symbolPair).to.be.eq(rawMarket.currency_pair)
    expect(baseSymbolId).to.be.eq(rawMarket.baseCurrency)
    expect(quoteSymbolId).to.be.eq(rawMarket.quoteCurrency)

    expect(high).to.be.eq(parseFloat(rawMarket.high_24h))
    expect(low).to.be.eq(parseFloat(rawMarket.low_24h))
    expect(bid).to.be.eq(parseFloat(rawMarket.highest_bid))
    expect(ask).to.be.eq(parseFloat(rawMarket.lowest_ask))
    expect(last).to.be.eq(parseFloat(rawMarket.last))
    expect(change).to.be.eq(parseFloat(rawMarket.change_percentage))
    expect(baseVolume).to.be.eq(parseFloat(rawMarket.base_volume))
    expect(quoteVolume).to.be.eq(parseFloat(rawMarket.quote_volume))
    expect(date).to.be.ok

    expect(spotEnabled).to.be.ok
    expect(marginEnabled).not.to.be.ok
    expect(derivativesEnabled).not.to.be.ok
    expect(instrument).not.to.be.ok
    expect(leverageEnabled).not.to.be.ok
    expect(maxLeverage).not.to.be.ok

  })

})
