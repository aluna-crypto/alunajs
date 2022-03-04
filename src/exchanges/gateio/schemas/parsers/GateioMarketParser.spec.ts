import { expect } from 'chai'

import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { Gateio } from '../../Gateio'
import { GATEIO_RAW_MARKETS } from '../../test/fixtures/gateioMarket'
import { GateioMarketParser } from './GateioMarketParser'



describe('GateioMarketParser', () => {


  it('should parse Gateio market just fine', async () => {

    const translatedSymbolId = 'ETH'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbolId,
    })

    const rawMarket = GATEIO_RAW_MARKETS[0]

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


    const [baseCurrency, quoteCurrency] = rawMarket.currency_pair.split('_')

    expect(exchangeId).to.be.eq(Gateio.ID)
    expect(symbolPair).to.be.eq(rawMarket.currency_pair)
    expect(baseSymbolId).to.be.eq(translatedSymbolId)
    expect(quoteSymbolId).to.be.eq(translatedSymbolId)

    expect(high).to.be.eq(Number(rawMarket.high_24h))
    expect(low).to.be.eq(Number(rawMarket.low_24h))
    expect(bid).to.be.eq(Number(rawMarket.highest_bid))
    expect(ask).to.be.eq(Number(rawMarket.lowest_ask))
    expect(last).to.be.eq(Number(rawMarket.last))
    expect(change).to.be.eq(Number(rawMarket.change_percentage))
    expect(baseVolume).to.be.eq(Number(rawMarket.base_volume))
    expect(quoteVolume).to.be.eq(Number(rawMarket.quote_volume))
    expect(date).to.be.ok

    expect(spotEnabled).to.be.ok
    expect(marginEnabled).not.to.be.ok
    expect(derivativesEnabled).not.to.be.ok
    expect(instrument).not.to.be.ok
    expect(leverageEnabled).not.to.be.ok
    expect(maxLeverage).not.to.be.ok

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: baseCurrency,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: {},
    })

  })

})
