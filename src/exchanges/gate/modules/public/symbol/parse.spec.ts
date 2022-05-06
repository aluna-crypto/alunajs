import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Gate } from '../../../Gate'
import { gateBaseSpecs } from '../../../gateSpecs'
import { GATE_RAW_SYMBOLS } from '../../../test/fixtures/gateSymbols'



describe.skip(__filename, () => {

  it('should parse a Gate symbol just fine (w/ alias)', async () => {

    // preparing data
    const rawSymbol = GATE_RAW_SYMBOLS[0] // first fixture

    const translatedSymbolId = 'XBT'


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Gate({})

    const { symbol: parsedSymbol1 } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(parsedSymbol1.exchangeId).to.be.eq(gateBaseSpecs.id)
    expect(parsedSymbol1.id).to.be.eq(translatedSymbolId)
    expect(parsedSymbol1.name).to.be.eq(rawSymbol.name)
    expect(parsedSymbol1.alias).to.be.eq(rawSymbol.symbol) // should be equal
    expect(parsedSymbol1.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.symbol,
      symbolMappings: undefined,
    })

  })



  it('should parse a Gate symbol just fine (w/o alias)', async () => {

    // preparing data
    const rawSymbol = GATE_RAW_SYMBOLS[1] // second fixture


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(rawSymbol.symbol)


    // executing
    const exchange = new Gate({})

    const { symbol: parsedSymbol1 } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(parsedSymbol1.exchangeId).to.be.eq(gateBaseSpecs.id)
    expect(parsedSymbol1.id).to.be.eq(rawSymbol.symbol)
    expect(parsedSymbol1.name).to.be.eq(rawSymbol.name)
    expect(parsedSymbol1.alias).to.be.eq(undefined) // different = undefined
    expect(parsedSymbol1.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)

    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.symbol,
      symbolMappings: undefined,
    })

  })

})
