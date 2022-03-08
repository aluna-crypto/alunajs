import { expect } from 'chai'

import { Exchanges } from './Exchanges'



describe('Exchanges', () => {

  it('should reference all implemented exchanges', async () => {

    expect(Exchanges.Valr).to.be.ok
    expect(Exchanges.Bitfinex).to.be.ok
    expect(Exchanges.Binance).to.be.ok
    expect(Exchanges.Gateio).to.be.ok
    expect(Exchanges.Ftx).to.be.ok

  })

})
