import { expect } from 'chai'

import { Gateio } from './Gateio'



describe('Gateio', () => {

  it('should have all static properties and methods', async () => {

    expect(Gateio.ID).to.eq('gateio')
    expect(Gateio.SPECS).to.be.ok
    // @TODO
    // expect(Gateio.Symbol).to.be.ok
    expect(Gateio.Market).to.be.ok

  })

  it('should have all instance properties and methods', async () => {

    const key = 'asdf'
    const secret = 'qwer'
    const referralCode = 'xyz'

    const gateio = new Gateio({
      keySecret: {
        key,
        secret,
      },
      settings: {
        referralCode,
      },
    })

    expect(gateio.keySecret.key).to.eq(key)
    expect(gateio.keySecret.secret).to.eq(secret)

    expect(gateio.settings).to.be.ok
    expect(gateio.settings?.referralCode).to.eq(referralCode)

    // @TODO
    // expect(gateio.key).to.be.ok
    expect(gateio.balance).to.be.ok
    // expect(gateio.order).to.be.ok

  })

})
