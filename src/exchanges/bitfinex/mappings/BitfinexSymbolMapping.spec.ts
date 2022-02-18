import { expect } from 'chai'

import { BitfinexSymbolMapping } from './BitfinexSymbolMapping'



describe('BitfinexSymbolMapping', () => {

  it('should properly translate Bitfinex symbol pair to aluna', () => {

    const mappings = {
      UST: 'USDT',
      UDC: 'USDC',
    }

    const symbolPair1 = 'tLUNA:UST'
    const symbolPair2 = 'tADAUDC'
    const symbolPair3 = 'tADAUSD'

    const pairs1 = BitfinexSymbolMapping.translateToAluna({
      symbolPair: symbolPair1,
      mappings,
    })

    expect(pairs1.baseSymbolId).to.be.eq('LUNA')
    expect(pairs1.quoteSymbolId).to.be.eq('USDT')


    const pairs2 = BitfinexSymbolMapping.translateToAluna({
      symbolPair: symbolPair2,
      mappings,
    })

    expect(pairs2.baseSymbolId).to.be.eq('ADA')
    expect(pairs2.quoteSymbolId).to.be.eq('USDC')


    const pairs3 = BitfinexSymbolMapping.translateToAluna({
      symbolPair: symbolPair3,
    })

    expect(pairs3.baseSymbolId).to.be.eq('ADA')
    expect(pairs3.quoteSymbolId).to.be.eq('USD')

  })

})
