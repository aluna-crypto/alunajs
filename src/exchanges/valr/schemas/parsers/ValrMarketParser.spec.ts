import { expect } from 'chai'

import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { VALR_RAW_MARKETS_WITH_CURRENCY } from '../../test/fixtures/valrMarket'
import { Valr } from '../../Valr'
import { ValrMarketParser } from './ValrMarketParser'



describe('ValrMarketParser', () => {

  it('should parse Valr market just fine', async () => {

    const translatedSymbolId = 'ETH'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbolId,
    })

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
    expect(baseSymbolId).to.be.eq(translatedSymbolId)
    expect(quoteSymbolId).to.be.eq(translatedSymbolId)

    expect(high).to.be.eq(Number(rawMarket.highPrice))
    expect(low).to.be.eq(Number(rawMarket.lowPrice))
    expect(bid).to.be.eq(Number(rawMarket.bidPrice))
    expect(ask).to.be.eq(Number(rawMarket.askPrice))
    expect(last).to.be.eq(Number(rawMarket.lastTradedPrice))
    expect(change).to.be.eq(Number(rawMarket.changeFromPrevious) / 100)
    expect(baseVolume).to.be.eq(Number(rawMarket.baseVolume))
    expect(date).to.be.ok

    expect(spotEnabled).not.to.be.ok
    expect(marginEnabled).not.to.be.ok
    expect(derivativesEnabled).not.to.be.ok
    expect(instrument).not.to.be.ok
    expect(leverageEnabled).not.to.be.ok
    expect(maxLeverage).not.to.be.ok

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: rawMarket.baseCurrency,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawMarket.quoteCurrency,
      symbolMappings: {},
    })

  })

})
