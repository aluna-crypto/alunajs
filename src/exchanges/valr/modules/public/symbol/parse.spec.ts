import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Valr } from '../../../Valr'
import { valrBaseSpecs } from '../../../valrSpecs'
import { VALR_RAW_SYMBOLS } from '../../../test/fixtures/valrSymbols'



describe(__filename, () => {

  it('should parse a Valr symbol just fine (w/ alias)', async () => {

    // preparing data
    const translatedSymbolId = 'XBT'

    const rawSymbol = VALR_RAW_SYMBOLS[0] // first fixture

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Valr({})

    const { symbol } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(symbol.exchangeId).to.be.eq(valrBaseSpecs.id)
    expect(symbol.id).to.be.eq(translatedSymbolId)
    expect(symbol.name).to.be.eq(rawSymbol.longName)
    expect(symbol.alias).to.be.eq(rawSymbol.symbol) // should be equal
    expect(symbol.meta).to.deep.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.symbol,
      symbolMappings: undefined,
    })

  })



  it('should parse a Valr symbol just fine (w/o alias)', async () => {

    // preparing data

    const rawSymbol = VALR_RAW_SYMBOLS[1] // second fixture

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(rawSymbol.symbol)


    // executing
    const exchange = new Valr({})


    const { symbol } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(symbol.exchangeId).to.be.eq(valrBaseSpecs.id)
    expect(symbol.id).to.be.eq(rawSymbol.symbol)
    expect(symbol.name).to.be.eq(rawSymbol.longName)
    expect(symbol.alias).to.be.eq(undefined) // different = undefined
    expect(symbol.meta).to.deep.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)

    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.symbol,
      symbolMappings: undefined,
    })

  })

})
