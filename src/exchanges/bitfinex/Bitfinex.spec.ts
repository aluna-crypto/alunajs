import { expect } from 'chai'
import { Agent } from 'https'

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

  it('should properly validate Bitfinex settings', async () => {

    expect(Bitfinex.validateSettings({ mappings: { BT: 'BTC' } })).to.be.ok
    expect(Bitfinex.validateSettings({ proxyAgent: new Agent() })).to.be.ok
    expect(Bitfinex.validateSettings({ affiliateCode: 'xyz' })).to.be.ok

    expect(Bitfinex.validateSettings({ orderAnnotation: 'Aluna' })).not.to.be.ok

  })


})
