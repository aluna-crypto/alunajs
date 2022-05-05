import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Bittrex } from '../../../Bittrex'
import { bittrexBaseSpecs } from '../../../bittrexSpecs'
import { BITTREX_RAW_MARKET } from '../../../test/fixtures/bittrexMarket'



describe(__filename, () => {

  it('should parse a Bittrex raw market just fine', async () => {

    // preparing data
    const translatedSymbolId = 'BTC'
    const rawMarket = BITTREX_RAW_MARKET


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Bittrex({})

    const { market } = exchange.market.parse({
      rawMarket,
    })


    // validating
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
      quoteVolume,
      low,
      bid,
      ask,
      last,
      change,
      date,
      baseVolume,
    } = ticker

    expect(exchangeId).to.be.eq(bittrexBaseSpecs.id)
    expect(symbolPair).to.be.eq(rawMarket.marketInfo.symbol)
    expect(baseSymbolId).to.be.eq(translatedSymbolId)
    expect(quoteSymbolId).to.be.eq(translatedSymbolId)

    expect(high).to.be.eq(Number(rawMarket.summary.high))
    expect(low).to.be.eq(Number(rawMarket.summary.low))
    expect(change).to.be.eq(Number(rawMarket.summary.percentChange) / 100)
    expect(baseVolume).to.be.eq(Number(rawMarket.summary.volume))
    expect(quoteVolume).to.be.eq(Number(rawMarket.summary.quoteVolume))
    expect(bid).to.be.eq(Number(rawMarket.ticker.bidRate))
    expect(ask).to.be.eq(Number(rawMarket.ticker.askRate))
    expect(last).to.be.eq(Number(rawMarket.ticker.lastTradeRate))
    expect(date).to.be.ok

    expect(spotEnabled).to.be.ok
    expect(marginEnabled).to.not.be.ok
    expect(derivativesEnabled).not.to.be.ok
    expect(instrument).not.to.be.ok
    expect(leverageEnabled).not.to.be.ok
    expect(maxLeverage).not.to.be.ok

    expect(translateSymbolId.callCount).to.be.eq(2)

    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawMarket.marketInfo.baseCurrencySymbol,
      symbolMappings: undefined,
    })

    expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawMarket.marketInfo.quoteCurrencySymbol,
      symbolMappings: undefined,
    })

  })

})
