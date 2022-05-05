import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Bitfinex } from '../../../Bitfinex'
import { bitfinexBaseSpecs } from '../../../bitfinexSpecs'
import { BITFINEX_RAW_SYMBOLS } from '../../../test/fixtures/bitfinexSymbols'



describe.skip(__filename, () => {

  it('should parse a Bitfinex symbol just fine (w/ alias)', async () => {

    // preparing data
    const translatedSymbolId = 'XBT'


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Bitfinex({})

    const rawSymbol = BITFINEX_RAW_SYMBOLS[0] // first fixture

    const { symbol: parsedSymbol1 } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(parsedSymbol1.exchangeId).to.be.eq(bitfinexBaseSpecs.id)
    expect(parsedSymbol1.id).to.be.eq(translatedSymbolId)
    expect(parsedSymbol1.name).to.be.eq(rawSymbol.name)
    expect(parsedSymbol1.alias).to.be.eq(rawSymbol.symbol) // should be equal

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.symbol,
      symbolMappings: undefined,
    })

  })



  it('should parse a Bitfinex symbol just fine (w/o alias)', async () => {

    // preparing data
    const translatedSymbolId = 'LTC'


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Bitfinex({})

    const rawSymbol = BITFINEX_RAW_SYMBOLS[1] // second fixture

    const { symbol: parsedSymbol1 } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(parsedSymbol1.exchangeId).to.be.eq(bitfinexBaseSpecs.id)
    expect(parsedSymbol1.id).to.be.eq(translatedSymbolId)
    expect(parsedSymbol1.name).to.be.eq(rawSymbol.name)
    expect(parsedSymbol1.alias).to.be.eq(undefined) // different = undefined

    expect(translateSymbolId.callCount).to.be.eq(1)

    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.symbol,
      symbolMappings: undefined,
    })

  })

})
