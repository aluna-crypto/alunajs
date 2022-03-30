import { expect } from 'chai'

import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { Poloniex } from '../../Poloniex'
import { POLONIEX_RAW_MARKETS_WITH_CURRENCY } from '../../test/fixtures/poloniexMarket'
import { PoloniexMarketParser } from './PoloniexMarketParser'



describe('PoloniexMarketParser', () => {


  it('should parse Poloniex market just fine', async () => {

    const translateSymbolId = 'BTC'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping()

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
      quoteVolume,
    } = ticker

    expect(exchangeId).to.be.eq(Poloniex.ID)
    expect(symbolPair).to.be.eq(rawMarket.currencyPair)
    expect(baseSymbolId).to.be.eq(translateSymbolId)
    expect(quoteSymbolId).to.be.eq(translateSymbolId)

    expect(high).to.be.eq(Number(rawMarket.high24hr))
    expect(low).to.be.eq(Number(rawMarket.low24hr))
    expect(bid).to.be.eq(Number(rawMarket.highestBid))
    expect(ask).to.be.eq(Number(rawMarket.lowestAsk))
    expect(last).to.be.eq(Number(rawMarket.last))
    expect(change).to.be.eq(Number(rawMarket.percentChange))
    expect(quoteVolume).to.be.eq(Number(rawMarket.baseVolume))
    expect(baseVolume).to.be.eq(Number(rawMarket.quoteVolume))
    expect(date).to.be.ok

    expect(spotEnabled).to.be.ok
    expect(marginEnabled).not.to.be.ok
    expect(derivativesEnabled).not.to.be.ok
    expect(instrument).not.to.be.ok
    expect(leverageEnabled).not.to.be.ok
    expect(maxLeverage).not.to.be.ok

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: rawMarket.baseCurrency,
      symbolMappings: Poloniex.settings.mappings,
    })
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawMarket.quoteCurrency,
      symbolMappings: Poloniex.settings.mappings,
    })

  })

})
