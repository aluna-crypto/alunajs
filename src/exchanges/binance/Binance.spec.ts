import { expect } from 'chai'

import { Binance } from './Binance'



describe('Binance', () => {


  it('should have all static properties and methods', async () => {

    expect(Binance.ID).to.eq('binance')
    expect(Binance.SPECS).to.be.ok
    expect(Binance.Symbol).to.be.ok
    expect(Binance.Market).to.be.ok

  })



  it('should have all instance properties and methods', async () => {

    const key = 'asdf'
    const secret = 'qwer'
    const referralCode = 'xyz'

    const binance = new Binance({
      keySecret: {
        key,
        secret,
      },
      settings: {
        referralCode,
      },
    })

    expect(binance.keySecret.key).to.eq(key)
    expect(binance.keySecret.secret).to.eq(secret)

    expect(binance.settings).to.be.ok
    expect(binance.settings?.referralCode).to.eq(referralCode)

    expect(binance.key).to.be.ok
    expect(binance.balance).to.be.ok
    expect(binance.order).to.be.ok

    expect(binance.position).not.to.be.ok

  })



})
