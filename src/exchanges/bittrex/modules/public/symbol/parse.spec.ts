import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../lib/utils/mappings/translateSymbolId.mock'
import { Bittrex } from '../../../Bittrex'
import { bittrexBaseSpecs } from '../../../bittrexSpecs'
import { BITTREX_RAW_SYMBOLS } from '../../../test/fixtures/bittrexSymbols'



describe(__filename, () => {


  it('should parse a Bittrex symbol just fine', async () => {

    const translatedSymbolId = 'ETH'

    const { translateSymbolId } = mockTranslateSymbolId(translatedSymbolId)

    const rawSymbol1 = BITTREX_RAW_SYMBOLS[0]
    const rawSymbol2 = BITTREX_RAW_SYMBOLS[1]

    const exchange = new Bittrex({ settings: {} })

    const { symbol: parsedSymbol1 } = exchange.symbol.parse({
      rawSymbol: rawSymbol1,
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(bittrexBaseSpecs.id)
    expect(parsedSymbol1.id).to.be.eq(translatedSymbolId)
    expect(parsedSymbol1.name).to.be.eq(rawSymbol1.name)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.args[0][0]).to.deep.eq({
      exchangeSymbolId: rawSymbol1.symbol,
      symbolMappings: undefined,
    })

    translateSymbolId.returns(rawSymbol2.symbol)

    const { symbol: parsedSymbol2 } = exchange.symbol.parse({
      rawSymbol: rawSymbol2,
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(bittrexBaseSpecs.id)
    expect(parsedSymbol2.id).to.be.eq(rawSymbol2.symbol)
    expect(parsedSymbol2.name).to.be.eq(rawSymbol2.name)

    expect(translateSymbolId.callCount).to.be.eq(2)
    expect(translateSymbolId.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawSymbol2.symbol,
      symbolMappings: undefined,
    })

  })

})
