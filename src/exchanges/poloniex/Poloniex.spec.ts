import { expect } from 'chai'

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
    const referralCode = 'xyz'

    const poloniex = new Poloniex({
      keySecret: {
        key,
        secret,
      },
      settings: {
        referralCode,
      },
    })

    expect(poloniex.keySecret.key).to.eq(key)
    expect(poloniex.keySecret.secret).to.eq(secret)

    expect(poloniex.settings).to.be.ok
    expect(poloniex.settings?.referralCode).to.eq(referralCode)

    expect(poloniex.key).to.be.ok
    expect(poloniex.balance).to.be.ok
    expect(poloniex.order).to.be.ok

  })

})
