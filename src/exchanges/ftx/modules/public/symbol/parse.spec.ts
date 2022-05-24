import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../../../../lib/schemas/IAlunaSettingsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Ftx } from '../../../Ftx'
import { ftxBaseSpecs } from '../../../ftxSpecs'
import { FTX_RAW_MARKETS } from '../../../test/fixtures/ftxMarket'



describe(__filename, () => {

  it('should parse a Ftx symbol just fine (w/ alias)', async () => {

    // preparing data
    const rawSymbol = FTX_RAW_MARKETS[0] // first fixture

    const translatedSymbolId = 'BTC'


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const settings: IAlunaSettingsSchema = {
      symbolMappings: {},
    }
    const exchange = new Ftx({ settings })

    const { symbol } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(symbol.exchangeId).to.be.eq(ftxBaseSpecs.id)
    expect(symbol.id).to.be.eq(translatedSymbolId)
    expect(symbol.alias).to.be.eq(rawSymbol.baseCurrency) // should be equal
    expect(symbol.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.baseCurrency,
      symbolMappings: settings.symbolMappings,
    })

  })



  it('should parse a Ftx symbol just fine (w/o alias)', async () => {

    // preparing data
    const rawSymbol = FTX_RAW_MARKETS[1] // second fixture


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(rawSymbol.baseCurrency)


    // executing
    const exchange = new Ftx({})

    const { symbol } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(symbol.exchangeId).to.be.eq(ftxBaseSpecs.id)
    expect(symbol.id).to.be.eq(rawSymbol.baseCurrency)
    expect(symbol.alias).to.be.eq(undefined) // different = undefined
    expect(symbol.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)

    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.baseCurrency,
      symbolMappings: undefined,
    })

  })

})
