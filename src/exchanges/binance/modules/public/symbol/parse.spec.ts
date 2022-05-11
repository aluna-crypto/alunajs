import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Binance } from '../../../Binance'
import { binanceBaseSpecs } from '../../../binanceSpecs'
import { BINANCE_RAW_SYMBOLS } from '../../../test/fixtures/binanceSymbols'



describe(__filename, () => {

  it('should parse a Binance symbol just fine (w/ alias)', async () => {

    // preparing data
    const rawSymbol = BINANCE_RAW_SYMBOLS[0] // first fixture

    const translatedSymbolId = 'XBT'


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Binance({})

    const { symbol: parsedSymbol1 } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(parsedSymbol1.exchangeId).to.be.eq(binanceBaseSpecs.id)
    expect(parsedSymbol1.id).to.be.eq(translatedSymbolId)
    expect(parsedSymbol1.alias).to.be.eq(rawSymbol.baseAsset) // should be equal
    expect(parsedSymbol1.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.baseAsset,
      symbolMappings: undefined,
    })

  })



  it('should parse a Binance symbol just fine (w/o alias)', async () => {

    // preparing data
    const rawSymbol = BINANCE_RAW_SYMBOLS[1] // second fixture


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(rawSymbol.baseAsset)


    // executing
    const exchange = new Binance({})

    const { symbol: parsedSymbol1 } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(parsedSymbol1.exchangeId).to.be.eq(binanceBaseSpecs.id)
    expect(parsedSymbol1.id).to.be.eq(rawSymbol.baseAsset)
    expect(parsedSymbol1.alias).to.be.eq(undefined) // different = undefined
    expect(parsedSymbol1.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)

    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.baseAsset,
      symbolMappings: undefined,
    })

  })

})
