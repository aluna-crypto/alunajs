import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { BitfinexAuthed } from './BitfinexAuthed'



describe(__filename, () => {

  it('should ensure exchange have all properties and methods', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '666',
    }

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const bitfinex = new BitfinexAuthed({
      credentials,
      settings,
    })

    expect(bitfinex.id).to.eq('bitfinex')
    expect(bitfinex.symbol).to.be.ok
    expect(bitfinex.market).to.be.ok
    expect(bitfinex.key).to.be.ok
    expect(bitfinex.balance).to.be.ok
    expect(bitfinex.order).to.be.ok
    expect(bitfinex.specs).to.be.ok
    expect(bitfinex.settings).to.deep.eq(settings)
    expect(bitfinex.credentials).to.deep.eq(credentials)

  })

})
