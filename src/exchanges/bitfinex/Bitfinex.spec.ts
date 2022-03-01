import { expect } from 'chai'

import { Bitfinex } from './Bitfinex'



describe('Bitfinex', () => {

  it('should have all static properties and methods', async () => {

    expect(Bitfinex.ID).to.eq('bitfinex')
    expect(Bitfinex.SPECS).to.be.ok
    expect(Bitfinex.Symbol).to.be.ok
    expect(Bitfinex.Market).to.be.ok

  })

  it('should have all instance properties and methods', async () => {

    const key = 'key'
    const secret = 'secret'

    const bitfinex = new Bitfinex({
      keySecret: {
        key,
        secret,
      },
    })

    expect(bitfinex.keySecret.key).to.eq(key)
    expect(bitfinex.keySecret.secret).to.eq(secret)

    expect(bitfinex.key).to.be.ok
    expect(bitfinex.balance).to.be.ok
    expect(bitfinex.order).to.be.ok
    expect(bitfinex.position).to.be.ok

  })

})
