import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { BitfinexAuthed } from './BitfinexAuthed'



describe(__filename, () => {

  it('should contain public & authed modules', async () => {

    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
    }

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const bitfinex = new BitfinexAuthed({ settings, credentials })

    expect(bitfinex.id).to.eq('bitfinex')

    expect(bitfinex.symbol).to.be.ok
    expect(bitfinex.market).to.be.ok

    expect(bitfinex.key).to.be.ok
    expect(bitfinex.balance).to.be.ok
    expect(bitfinex.order).to.be.ok
    expect(bitfinex.position).to.be.ok

    expect(bitfinex.specs).to.be.ok
    expect(bitfinex.settings).to.deep.eq(bitfinex.settings)

  })

})
