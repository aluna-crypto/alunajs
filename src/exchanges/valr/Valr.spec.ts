import { expect } from 'chai'
import { Agent } from 'https'

import { Valr } from './Valr'



describe('Valr', () => {

  it('should have all static properties and methods', async () => {

    expect(Valr.ID).to.eq('valr')
    expect(Valr.SPECS).to.be.ok
    expect(Valr.Symbol).to.be.ok
    expect(Valr.Market).to.be.ok

  })

  it('should have all instance properties and methods', async () => {

    const key = 'asdf'
    const secret = 'qwer'

    const valr = new Valr({
      keySecret: {
        key,
        secret,
      },
    })

    expect(valr.keySecret.key).to.eq(key)
    expect(valr.keySecret.secret).to.eq(secret)

    expect(valr.key).to.be.ok
    expect(valr.balance).to.be.ok
    expect(valr.order).to.be.ok

    // valr doesn't have margin trading
    expect(valr.position).not.to.be.ok

  })

  it('should properly validate Valr settings', async () => {

    expect(Valr.validateSettings({ mappings: { BT: 'BTC' } })).to.be.ok
    expect(Valr.validateSettings({ proxyAgent: new Agent() })).to.be.ok

    expect(Valr.validateSettings({ orderAnnotation: 'Aluna' })).not.to.be.ok
    expect(Valr.validateSettings({ affiliateCode: 'xyz' })).not.to.be.ok

  })

})
