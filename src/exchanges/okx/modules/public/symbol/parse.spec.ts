import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../../../../lib/schemas/IAlunaSettingsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Okx } from '../../../Okx'
import { okxBaseSpecs } from '../../../okxSpecs'
import { OKX_RAW_SYMBOLS } from '../../../test/fixtures/okxSymbols'



describe(__filename, () => {

  it('should parse a Okx symbol just fine (w/ alias)', async () => {

    // preparing data
    const rawSymbol = OKX_RAW_SYMBOLS[0] // first fixture

    const translatedSymbolId = 'USDT'


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const settings: IAlunaSettingsSchema = {
      symbolMappings: {},
    }
    const exchange = new Okx({ settings })

    const { symbol } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(symbol.exchangeId).to.be.eq(okxBaseSpecs.id)
    expect(symbol.id).to.be.eq(translatedSymbolId)
    expect(symbol.alias).to.be.eq(rawSymbol.baseCcy) // should be equal
    expect(symbol.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.baseCcy,
      symbolMappings: settings.symbolMappings,
    })

  })



  it('should parse a Okx symbol just fine (w/o alias)', async () => {

    // preparing data
    const rawSymbol = OKX_RAW_SYMBOLS[1] // second fixture


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(rawSymbol.baseCcy)


    // executing
    const exchange = new Okx({})

    const { symbol } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(symbol.exchangeId).to.be.eq(okxBaseSpecs.id)
    expect(symbol.id).to.be.eq(rawSymbol.baseCcy)
    expect(symbol.alias).to.be.eq(undefined) // different = undefined
    expect(symbol.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)

    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.baseCcy,
      symbolMappings: undefined,
    })

  })

})
