import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../../../../lib/schemas/IAlunaSettingsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Bitmex } from '../../../Bitmex'
import { bitmexBaseSpecs } from '../../../bitmexSpecs'
import { BITMEX_RAW_SYMBOLS } from '../../../test/fixtures/bitmexSymbols'



describe(__filename, () => {

  it('should parse a Bitmex symbol just fine (w/ alias)', async () => {

    // preparing data
    const rawSymbol = BITMEX_RAW_SYMBOLS[0]
    const translatedSymbolId = 'XYZ'


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(translatedSymbolId)


    // executing

    const settings: IAlunaSettingsSchema = {
      symbolMappings: {},
    }
    const exchange = new Bitmex({ settings })

    const { symbol } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(symbol.exchangeId).to.be.eq(bitmexBaseSpecs.id)
    expect(symbol.id).to.be.eq(translatedSymbolId)
    expect(symbol.name).not.to.be.ok
    expect(symbol.alias).to.be.eq(rawSymbol.rootSymbol)
    expect(symbol.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.rootSymbol,
      symbolMappings: settings.symbolMappings,
    })

  })

  it('should parse a Bitmex symbol just fine (w/o alias)', async () => {

    // preparing data
    const rawSymbol = BITMEX_RAW_SYMBOLS[1] // second fixture


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(rawSymbol.rootSymbol)


    // executing
    const exchange = new Bitmex({})
    const { symbol } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(symbol.exchangeId).to.be.eq(bitmexBaseSpecs.id)
    expect(symbol.id).to.be.eq(rawSymbol.rootSymbol)
    expect(symbol.name).not.to.be.ok
    expect(symbol.alias).to.be.eq(undefined) // different = undefined
    expect(symbol.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)

    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.rootSymbol,
      symbolMappings: undefined,
    })

  })

})
