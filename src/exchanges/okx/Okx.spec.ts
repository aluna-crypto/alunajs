import { expect } from 'chai'

import { AlunaProtocolsEnum } from '../../lib/enums/AlunaProxyAgentEnum'
import { Okx } from './Okx'



describe('Okx', () => {


  it('should have all static properties and methods', async () => {

    expect(Okx.ID).to.eq('okx')
    expect(Okx.SPECS).to.be.ok
    expect(Okx.Symbol).to.be.ok
    expect(Okx.Market).to.be.ok

  })



  it('should have all instance properties and methods', async () => {

    const key = 'asdf'
    const secret = 'qwer'

    const okx = new Okx({
      keySecret: {
        key,
        secret,
      },
    })

    expect(okx.keySecret.key).to.eq(key)
    expect(okx.keySecret.secret).to.eq(secret)

    // expect(okx.key).to.be.ok // @TODO
    expect(okx.balance).to.be.ok
    // expect(okx.order).to.be.ok

    expect(okx.position).not.to.be.ok

  })

  it('should properly validate Okx settings', async () => {

    expect(Okx.validateSettings({ mappings: { BT: 'BTC' } })).to.be.ok
    expect(Okx.validateSettings({
      proxySettings: {
        host: 'host',
        port: 9999,
        protocol: AlunaProtocolsEnum.HTTP,
      },
    })).to.be.ok

    expect(Okx.validateSettings({ orderAnnotation: 'Aluna' })).not.to.be.ok
    expect(Okx.validateSettings({ affiliateCode: 'xyz' })).not.to.be.ok

  })

})
