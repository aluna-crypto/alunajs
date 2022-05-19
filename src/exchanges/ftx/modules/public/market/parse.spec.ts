import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Ftx } from '../../../Ftx'
import { FTX_RAW_MARKETS } from '../../../test/fixtures/ftxMarket'



describe(__filename, () => {

  it('should parse a Ftx raw market just fine', async () => {

    // preparing data
    const rawMarket = FTX_RAW_MARKETS[0]

    const {
      baseCurrency,
      quoteCurrency,
    } = rawMarket


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId
      .onFirstCall()
      .returns(baseCurrency)
    translateSymbolId
      .onSecondCall()
      .returns(quoteCurrency)


    // executing
    const exchange = new Ftx({})

    const { market } = exchange.market.parse({
      rawMarket,
    })


    // validating
    expect(market).to.exist

    expect(market.exchangeId).to.be.eq(exchange.specs.id)
    expect(market.symbolPair).to.be.eq(rawMarket.name)
    expect(market.baseSymbolId).to.be.eq(baseCurrency)
    expect(market.quoteSymbolId).to.be.eq(quoteCurrency)

    expect(market.ticker.high).to.be.eq(rawMarket.price)
    expect(market.ticker.low).to.be.eq(rawMarket.price)
    expect(market.ticker.bid).to.be.eq(rawMarket.bid)
    expect(market.ticker.ask).to.be.eq(rawMarket.ask)
    expect(market.ticker.last).to.be.eq(rawMarket.last)
    expect(market.ticker.change).to.be.eq(rawMarket.change24h)
    expect(market.ticker.baseVolume).to.be.eq(0)
    expect(market.ticker.quoteVolume).to.be.eq(rawMarket.quoteVolume24h)
    expect(market.ticker.date).to.be.ok

    expect(market.spotEnabled).to.be.ok
    expect(market.marginEnabled).not.to.be.ok
    expect(market.derivativesEnabled).not.to.be.ok
    expect(market.instrument).not.to.be.ok
    expect(market.leverageEnabled).not.to.be.ok
    expect(market.maxLeverage).not.to.be.ok

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

  it('should parse a Ftx raw market just fine w/ usd base currency', async () => {

    // preparing data
    const rawMarket = cloneDeep(FTX_RAW_MARKETS[0])

    rawMarket.baseCurrency = 'USD'

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(rawMarket.baseCurrency)


    // executing
    const exchange = new Ftx({})

    const { market } = exchange.market.parse({
      rawMarket,
    })

    // validating
    expect(market).to.exist

    expect(market.exchangeId).to.be.eq(exchange.specs.id)
    expect(market.symbolPair).to.be.eq(rawMarket.name)
    expect(market.baseSymbolId).to.be.eq(rawMarket.baseCurrency)
    expect(market.quoteSymbolId).to.be.eq(rawMarket.quoteCurrency)

    expect(market.ticker.baseVolume).to.be.eq(rawMarket.volumeUsd24h)

  })

})
