import { expect } from 'chai'

import { Ftx } from './Ftx'



describe('Ftx', () => {

  it('should have all static properties and methods', async () => {

    expect(Ftx.ID).to.eq('ftx')
    expect(Ftx.SPECS).to.be.ok
    expect(Ftx.Symbol).to.be.ok
    expect(Ftx.Market).to.be.ok

  })

  it('should have all instance properties and methods', async () => {

    const key = 'asdf'
    const secret = 'qwer'

    const ftx = new Ftx({
      keySecret: {
        key,
        secret,
      },
    })

    expect(ftx.keySecret.key).to.eq(key)
    expect(ftx.keySecret.secret).to.eq(secret)

    expect(ftx.key).to.be.ok
    expect(ftx.balance).to.be.ok
    expect(ftx.order).to.be.ok

  })

})
