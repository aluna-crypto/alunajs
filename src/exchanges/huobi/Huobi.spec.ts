import { expect } from 'chai'

import { AlunaProtocolsEnum } from '../../lib/enums/AlunaProxyAgentEnum'
import { Huobi } from './Huobi'



describe('Huobi', () => {


  it('should have all static properties and methods', async () => {

    expect(Huobi.ID).to.eq('huobi')
    expect(Huobi.SPECS).to.be.ok
    expect(Huobi.Symbol).to.be.ok
    expect(Huobi.Market).to.be.ok

  })



  it('should have all instance properties and methods', async () => {

    const key = 'asdf'
    const secret = 'qwer'

    const huobi = new Huobi({
      keySecret: {
        key,
        secret,
      },
    })

    expect(huobi.keySecret.key).to.eq(key)
    expect(huobi.keySecret.secret).to.eq(secret)

    expect(huobi.key).to.be.ok
    expect(huobi.balance).to.be.ok
    expect(huobi.order).to.be.ok

    expect(huobi.position).not.to.be.ok

  })

  it('should properly validate Huobi settings', async () => {

    expect(Huobi.validateSettings({ mappings: { BT: 'BTC' } })).to.be.ok
    expect(Huobi.validateSettings({
      proxySettings: {
        host: 'host',
        port: 9999,
        protocol: AlunaProtocolsEnum.HTTP,
      },
    })).to.be.ok

    expect(Huobi.validateSettings({ orderAnnotation: 'Aluna' })).not.to.be.ok
    expect(Huobi.validateSettings({ affiliateCode: 'xyz' })).not.to.be.ok

  })

})
