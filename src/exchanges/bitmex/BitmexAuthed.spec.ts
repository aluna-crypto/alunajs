import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { BitmexAuthed } from './BitmexAuthed'



describe(__filename, () => {

  it('should contain public & authed modules', async () => {

    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
    }

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const bitmex = new BitmexAuthed({ settings, credentials })

    expect(bitmex.id).to.eq('bitmex')

    expect(bitmex.symbol).to.be.ok
    expect(bitmex.market).to.be.ok

    expect(bitmex.key).to.be.ok
    expect(bitmex.balance).to.be.ok
    expect(bitmex.order).to.be.ok
    expect(bitmex.position).to.be.ok

    expect(bitmex.specs).to.be.ok
    expect(bitmex.settings).to.deep.eq(bitmex.settings)

  })

})
