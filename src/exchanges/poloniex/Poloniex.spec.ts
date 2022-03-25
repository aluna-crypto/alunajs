import { expect } from 'chai'
import { Agent } from 'https'

import { Poloniex } from './Poloniex'



describe('Poloniex', () => {

  it('should have all static properties and methods', async () => {

    expect(Poloniex.ID).to.eq('poloniex')
    expect(Poloniex.SPECS).to.be.ok
    expect(Poloniex.Symbol).to.be.ok
    expect(Poloniex.Market).to.be.ok

  })

  it('should have all instance properties and methods', async () => {

    const key = 'asdf'
    const secret = 'qwer'

    const poloniex = new Poloniex({
      keySecret: {
        key,
        secret,
      },
    })

    expect(poloniex.keySecret.key).to.eq(key)
    expect(poloniex.keySecret.secret).to.eq(secret)

    expect(poloniex.key).to.be.ok
    expect(poloniex.balance).to.be.ok
    expect(poloniex.order).to.be.ok

  })

  it('should properly validate Poloniex settings', async () => {

    expect(Poloniex.validateSettings({ mappings: { BT: 'BTC' } })).to.be.ok
    expect(Poloniex.validateSettings({ proxyAgent: new Agent() })).to.be.ok

    expect(Poloniex.validateSettings({ orderAnnotation: 'Aluna' })).not.to.be.ok
    expect(Poloniex.validateSettings({ affiliateCode: 'xyz' })).not.to.be.ok

  })

})
