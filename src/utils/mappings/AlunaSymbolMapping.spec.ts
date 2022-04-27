import { expect } from 'chai'

import { AlunaSymbolMapping } from './AlunaSymbolMapping'



describe(__filename, () => {

  it('should properly translate symbol using given mapping', () => {

    const exchangeSymbolId = 'UST'
    const alunaSymbol = 'USDT'

    const symbolMappings: Record<string, string> = {
      [exchangeSymbolId]: alunaSymbol,
    }

    const translatedSymbol = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId,
      symbolMappings,
    })

    expect(translatedSymbol).to.be.eq(alunaSymbol)

  })

  it(
    'should default to exchange symbol when mapping does not include symbol',
    () => {

      const exchangeSymbolId = 'UST'

      const symbolMappings: Record<string, string> = {}

      const translatedSymbol = AlunaSymbolMapping.translateSymbolId({
        exchangeSymbolId,
        symbolMappings,
      })

      expect(translatedSymbol).to.be.eq(exchangeSymbolId)

    },
  )

  it('should default to exchange symbol when mapping does not exists', () => {

    const exchangeSymbolId = 'UST'

    const symbolMappings: Record<string, string> | undefined = undefined

    const translatedSymbol = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId,
      symbolMappings,
    })

    expect(translatedSymbol).to.be.eq(exchangeSymbolId)

  })

})
