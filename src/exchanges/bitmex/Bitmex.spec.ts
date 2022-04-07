import { expect } from 'chai'

import { AlunaProtocolsEnum } from '../../lib/enums/AlunaProxyAgentEnum'
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

    const bitmex = new Bitmex({
      keySecret: {
        key,
        secret,
      },
    })

    expect(bitmex.keySecret.key).to.eq(key)
    expect(bitmex.keySecret.secret).to.eq(secret)

    expect(bitmex.key).to.be.ok
    expect(bitmex.balance).to.be.ok
    expect(bitmex.order).to.be.ok
    expect(bitmex.position).to.be.ok

  })

  it('should properly validate Bitmex settings', async () => {

    expect(Bitmex.validateSettings({ mappings: { BT: 'BTC' } })).to.be.ok
    expect(Bitmex.validateSettings({
      proxySettings: {
        host: 'host',
        port: 9999,
        protocol: AlunaProtocolsEnum.HTTP,
      },
    })).to.be.ok

    expect(Bitmex.validateSettings({ orderAnnotation: 'Aluna' })).to.be.ok
    expect(Bitmex.validateSettings({ affiliateCode: 'xyz' })).not.to.be.ok

  })


})
