import { expect } from 'chai'

import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { Bittrex } from '../../Bittrex'
import { BITTREX_RAW_MARKETS_WITH_TICKER } from '../../test/fixtures/bittrexMarket'
import { BittrexMarketParser } from './BittrexMarketParser'



describe('BittrexMarketParser', () => {


  it('should parse Bittrex market just fine', async () => {

    const translatedSymbolId = 'ETH'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbolId,
    })

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
    expect(baseSymbolId).to.be.eq(translatedSymbolId)
    expect(quoteSymbolId).to.be.eq(translatedSymbolId)

    expect(high).to.be.eq(Number(rawMarket.high))
    expect(low).to.be.eq(Number(rawMarket.low))
    expect(bid).to.be.eq(Number(rawMarket.bidRate))
    expect(ask).to.be.eq(Number(rawMarket.askRate))
    expect(last).to.be.eq(Number(rawMarket.lastTradeRate))
    expect(change).to.be.eq(Number(rawMarket.percentChange) / 100)
    expect(baseVolume).to.be.eq(Number(rawMarket.volume))
    expect(quoteVolume).to.be.eq(Number(rawMarket.quoteVolume))
    expect(date).to.be.ok

    expect(spotEnabled).to.be.ok
    expect(marginEnabled).to.not.be.ok
    expect(derivativesEnabled).not.to.be.ok
    expect(instrument).not.to.be.ok
    expect(leverageEnabled).not.to.be.ok
    expect(maxLeverage).not.to.be.ok

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: rawMarket.baseCurrencySymbol,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawMarket.quoteCurrencySymbol,
      symbolMappings: {},
    })

  })

})
