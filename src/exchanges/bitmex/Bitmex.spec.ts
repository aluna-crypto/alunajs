import { expect } from 'chai'

import { Bitmex } from './Bitmex'
import { BitmexSpecs } from './BitmexSpecs'



describe('Bitmex', () => {

  it('should have all static properties and methods', async () => {

    expect(Bitmex.ID).to.eq(BitmexSpecs.id)
    expect(Bitmex.SPECS).to.be.ok
    expect(Bitmex.Symbol).to.be.ok
    expect(Bitmex.Market).to.be.ok

  })

  it('should have all instance properties and methods', async () => {

    const key = 'key'
    const secret = 'secret'
    const referralCode = 'myReferral'

    const bitmex = new Bitmex({
      keySecret: {
        key,
        secret,
      },
      settings: {
        referralCode,
      },
    })

    expect(bitmex.keySecret.key).to.eq(key)
    expect(bitmex.keySecret.secret).to.eq(secret)

    expect(bitmex.settings).to.be.ok
    expect(bitmex.settings?.referralCode).to.eq(referralCode)

    expect(bitmex.key).to.be.ok
    expect(bitmex.balance).to.be.ok
    // expect(bitmex.order).to.be.ok
    // expect(bitmex.position).to.be.ok

  })

})
