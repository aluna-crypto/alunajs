import { expect } from 'chai'

import { splitFtxSymbolPair } from './splitFtxSymbolPair'



describe(__filename, () => {

  it('should split Ftx spot market just fine', async () => {

    // preparing data
    const market = 'BTC/ETH'


    // executing
    const {
      baseSymbolId,
      quoteSymbolId,
    } = splitFtxSymbolPair({ market })

    expect(baseSymbolId).to.be.eq(market.split(/\//)[0])
    expect(quoteSymbolId).to.be.eq(market.split(/\//)[1])

  })

  it('should split Ftx future market just fine', async () => {

    // preparing data
    const market = 'BTC-PERP'


    // executing
    const {
      baseSymbolId,
      quoteSymbolId,
    } = splitFtxSymbolPair({ market })

    expect(baseSymbolId).to.be.eq(market.split(/-/)[0])
    expect(quoteSymbolId).to.be.eq('USD')

  })

})
