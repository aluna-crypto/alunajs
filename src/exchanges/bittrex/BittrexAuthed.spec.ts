import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { BittrexAuthed } from './BittrexAuthed'



describe(__filename, () => {

  it('should contain public & authed modules', async () => {

    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
    }

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const bittrex = new BittrexAuthed({ settings, credentials })

    expect(bittrex.id).to.eq('bittrex')

    expect(bittrex.symbol).to.be.ok
    expect(bittrex.market).to.be.ok

    expect(bittrex.key).to.be.ok
    expect(bittrex.balance).to.be.ok
    expect(bittrex.order).to.be.ok

    expect(bittrex.specs).to.be.ok
    expect(bittrex.settings).to.deep.eq(bittrex.settings)

  })

})
