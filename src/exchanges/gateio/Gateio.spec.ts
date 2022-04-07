import { expect } from 'chai'

import { AlunaProtocolsEnum } from '../../lib/enums/AlunaProxyAgentEnum'
import { Gateio } from './Gateio'



describe('Gateio', () => {

  it('should have all static properties and methods', async () => {

    expect(Gateio.ID).to.eq('gateio')
    expect(Gateio.SPECS).to.be.ok
    expect(Gateio.Symbol).to.be.ok
    expect(Gateio.Market).to.be.ok

  })

  it('should have all instance properties and methods', async () => {

    const key = 'asdf'
    const secret = 'qwer'

    const gateio = new Gateio({
      keySecret: {
        key,
        secret,
      },
    })

    expect(gateio.keySecret.key).to.eq(key)
    expect(gateio.keySecret.secret).to.eq(secret)

    expect(gateio.key).to.be.ok
    expect(gateio.balance).to.be.ok
    expect(gateio.order).to.be.ok

  })

  it('should properly validate Gateio settings', async () => {

    expect(Gateio.validateSettings({ mappings: { BT: 'BTC' } })).to.be.ok
    expect(Gateio.validateSettings({
      proxySettings: {
        host: 'host',
        port: 9999,
        protocol: AlunaProtocolsEnum.HTTP,
      },
    })).to.be.ok

    expect(Gateio.validateSettings({ orderAnnotation: 'Aluna' })).to.be.ok
    expect(Gateio.validateSettings({ affiliateCode: 'xyz' })).not.to.be.ok

  })

})
