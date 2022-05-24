import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Huobi } from '../../../Huobi'
import { HUOBI_RAW_MARKETS } from '../../../test/fixtures/huobiMarket'
import { HUOBI_RAW_SYMBOLS } from '../../../test/fixtures/huobiSymbols'



describe(__filename, () => {

  it('should parse a Huobi raw market just fine', async () => {

    // preparing data
    const rawMarket = HUOBI_RAW_MARKETS[0]
    const rawSymbol = HUOBI_RAW_SYMBOLS[0]

    const {
      bc: baseCurrency,
      qc: quoteCurrency,
    } = rawSymbol


    const rawMarketRequest = {
      rawMarket,
      rawSymbol,
    }

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseCurrency)

    translateSymbolId.onSecondCall().returns(quoteCurrency)

    // executing
    const exchange = new Huobi({})

    const { market } = exchange.market.parse({
      rawMarket: rawMarketRequest,
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
    } = market

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


    // validating
    expect(market).to.exist
    expect(exchangeId).to.be.eq(exchange.id)
    expect(symbolPair).to.be.eq(rawMarket.symbol)
    expect(baseSymbolId).to.be.eq(baseCurrency)
    expect(quoteSymbolId).to.be.eq(quoteCurrency)

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

    expect(translateSymbolId.callCount).to.be.eq(2)

    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: baseCurrency,
      symbolMappings: exchange.settings.symbolMappings,
    })

    expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: exchange.settings.symbolMappings,
    })

  })

})
