import { expect } from 'chai'

import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { Okx } from '../../Okx'
import { OKX_RAW_MARKETS } from '../../test/fixtures/okxMarket'
import { OKX_RAW_MARGIN_SYMBOLS, OKX_RAW_SPOT_SYMBOLS } from '../../test/fixtures/okxSymbol'
import { OkxMarketParser } from './OkxMarketParser'



describe('OkxMarketParser', () => {


  it('should parse Okx market just fine', async () => {

    const translatedSymbolId = 'BTC'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbolId,
    })

    const rawMarket = OKX_RAW_MARKETS[0]
    const rawSpotSymbols = OKX_RAW_MARGIN_SYMBOLS
    const rawMarginSymbols = OKX_RAW_SPOT_SYMBOLS

    const parsedMarket = OkxMarketParser.parse({
      rawMarket,
      rawMarginSymbols,
      rawSpotSymbols,
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

    expect(exchangeId).to.be.eq(Okx.ID)
    expect(symbolPair).to.be.eq(rawMarket.instId)
    expect(baseSymbolId).to.be.eq(translatedSymbolId)
    expect(quoteSymbolId).to.be.eq(translatedSymbolId)

    expect(high).to.be.eq(parseFloat(rawMarket.high24h))
    expect(low).to.be.eq(parseFloat(rawMarket.low24h))
    expect(bid).to.be.eq(parseFloat(rawMarket.bidPx))
    expect(ask).to.be.eq(parseFloat(rawMarket.askPx))
    expect(last).to.be.eq(parseFloat(rawMarket.last))
    expect(change).to.be.eq(
      parseFloat(rawMarket.open24h) - parseFloat(rawMarket.last),
    )
    expect(baseVolume).to.be.eq(parseFloat(rawMarket.vol24h))
    expect(date).to.be.ok

    expect(spotEnabled).to.be.ok
    expect(marginEnabled).to.be.ok
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
