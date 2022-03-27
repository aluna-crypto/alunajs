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

    const binance = new Binance({
      keySecret: {
        key,
        secret,
      },
    })

    expect(binance.keySecret.key).to.eq(key)
    expect(binance.keySecret.secret).to.eq(secret)

    expect(binance.key).to.be.ok
    expect(binance.balance).to.be.ok
    expect(binance.order).to.be.ok

    expect(binance.position).not.to.be.ok

  })

  it('should properly validate Binance settings', async () => {

    expect(Binance.validateSettings({ mappings: { BT: 'BTC' } })).to.be.ok
    expect(Binance.validateSettings({
      proxySettings: {
        host: 'host',
        port: 9999,
        protocol: 'http',
      },
    })).to.be.ok

    expect(Binance.validateSettings({ orderAnnotation: 'Aluna' })).not.to.be.ok
    expect(Binance.validateSettings({ affiliateCode: 'xyz' })).not.to.be.ok

  })

})
