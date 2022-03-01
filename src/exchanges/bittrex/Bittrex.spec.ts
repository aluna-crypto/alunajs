import { expect } from 'chai'

import { Bittrex } from './Bittrex'



describe('Bittrex', () => {

  it('should have all static properties and methods', async () => {

    expect(Bittrex.ID).to.eq('bittrex')
    expect(Bittrex.SPECS).to.be.ok
    expect(Bittrex.Symbol).to.be.ok
    expect(Bittrex.Market).to.be.ok

  })

  it('should have all instance properties and methods', async () => {

    const key = 'asdf'
    const secret = 'qwer'
    const referralCode = 'xyz'

    const bittrex = new Bittrex({
      keySecret: {
        key,
        secret,
      },
      settings: {
        referralCode,
      },
    })

    expect(bittrex.keySecret.key).to.eq(key)
    expect(bittrex.keySecret.secret).to.eq(secret)

    expect(bittrex.key).to.be.ok
    expect(bittrex.balance).to.be.ok
    expect(bittrex.order).to.be.ok

  })

})
