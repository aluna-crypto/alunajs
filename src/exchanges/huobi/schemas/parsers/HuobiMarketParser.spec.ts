import { expect } from 'chai'

import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { Huobi } from '../../Huobi'
import { HUOBI_RAW_MARKETS_WITH_CURRENCY } from '../../test/fixtures/huobiMarket'
import { HuobiMarketParser } from './HuobiMarketParser'



describe('HuobiMarketParser', () => {


  it('should parse Huobi market just fine', async () => {

    const translatedSymbolId = 'ETH'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbolId,
    })

    const rawMarket = HUOBI_RAW_MARKETS_WITH_CURRENCY[0]

    const parsedMarket = HuobiMarketParser.parse({
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

    expect(exchangeId).to.be.eq(Huobi.ID)
    expect(symbolPair).to.be.eq(rawMarket.symbol)
    expect(baseSymbolId).to.be.eq(translatedSymbolId)
    expect(quoteSymbolId).to.be.eq(translatedSymbolId)

    expect(high).to.be.eq(rawMarket.high)
    expect(low).to.be.eq(rawMarket.low)
    expect(bid).to.be.eq(rawMarket.bid)
    expect(ask).to.be.eq(rawMarket.ask)
    expect(last).to.be.eq(rawMarket.close)
    expect(change).to.be.eq(rawMarket.open - rawMarket.close)
    expect(baseVolume).to.be.eq(rawMarket.amount)
    expect(quoteVolume).to.be.eq(rawMarket.vol)
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
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawMarket.quoteCurrency,
      symbolMappings: {},
    })

  })

})
