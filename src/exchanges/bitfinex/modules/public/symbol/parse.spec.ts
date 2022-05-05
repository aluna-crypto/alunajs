import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Bitfinex } from '../../../Bitfinex'
import { bitfinexBaseSpecs } from '../../../bitfinexSpecs'
import { BITFINEX_RAW_SYMBOL } from '../../../test/fixtures/bitfinexSymbols'



describe(__filename, () => {

  it('should parse a Bitfinex symbol just fine (w/ alias)', async () => {

    // preparing data
    const rawSymbol = BITFINEX_RAW_SYMBOL

    const translatedSymbolId = 'XBT'


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Bitfinex({})


    const { symbol } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(symbol.exchangeId).to.be.eq(bitfinexBaseSpecs.id)
    expect(symbol.id).to.be.eq(translatedSymbolId)
    expect(symbol.name).to.be.eq(rawSymbol.currencyName?.[1])
    expect(symbol.alias).to.be.eq(rawSymbol.currency) // should be equal
    expect(symbol.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.currency,
      symbolMappings: undefined,
    })

  })



  it('should parse a Bitfinex symbol just fine (w/o alias)', async () => {

    // preparing data
    const rawSymbol = BITFINEX_RAW_SYMBOL

    const translatedSymbolId = rawSymbol.currency


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Bitfinex({})


    const { symbol } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(symbol.exchangeId).to.be.eq(bitfinexBaseSpecs.id)
    expect(symbol.id).to.be.eq(translatedSymbolId)
    expect(symbol.name).to.be.eq(rawSymbol.currencyName?.[1])
    expect(symbol.alias).not.to.be.ok
    expect(symbol.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.currency,
      symbolMappings: undefined,
    })

  })

})
