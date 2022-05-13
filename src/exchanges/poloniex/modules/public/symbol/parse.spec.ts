import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../../../../lib/schemas/IAlunaSettingsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Poloniex } from '../../../Poloniex'
import { poloniexBaseSpecs } from '../../../poloniexSpecs'
import { POLONIEX_RAW_SYMBOLS } from '../../../test/fixtures/poloniexSymbols'



describe(__filename, () => {

  it('should parse a Poloniex symbol just fine (w/ alias)', async () => {

    // preparing data
    const rawSymbol = POLONIEX_RAW_SYMBOLS[0] // first fixture

    const translatedSymbolId = 'BTC'

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const settings: IAlunaSettingsSchema = {
      symbolMappings: {},
    }
    const exchange = new Poloniex({ settings })

    const { symbol } = exchange.symbol.parse({ rawSymbol })

    // validating
    expect(symbol.exchangeId).to.be.eq(poloniexBaseSpecs.id)
    expect(symbol.id).to.be.eq(translatedSymbolId)
    expect(symbol.name).to.be.eq(rawSymbol.name)
    expect(symbol.alias).to.be.eq(rawSymbol.currency) // should be equal
    expect(symbol.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.currency,
      symbolMappings: settings.symbolMappings,
    })

  })



  it('should parse a Poloniex symbol just fine (w/o alias)', async () => {

    // preparing data
    const rawSymbol = POLONIEX_RAW_SYMBOLS[1] // second fixture


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(rawSymbol.currency)


    // executing
    const exchange = new Poloniex({})

    const { symbol } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(symbol.exchangeId).to.be.eq(poloniexBaseSpecs.id)
    expect(symbol.id).to.be.eq(rawSymbol.currency)
    expect(symbol.name).to.be.eq(rawSymbol.name)
    expect(symbol.alias).to.be.eq(undefined) // different = undefined
    expect(symbol.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)

    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.currency,
      symbolMappings: undefined,
    })

  })

})
