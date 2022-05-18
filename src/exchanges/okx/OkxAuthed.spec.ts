import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { OkxAuthed } from './OkxAuthed'



describe(__filename, () => {

  it('should contain public & authed modules', async () => {

    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
    }

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const okx = new OkxAuthed({ settings, credentials })

    expect(okx.id).to.eq('okx')

    expect(okx.symbol).to.be.ok
    expect(okx.market).to.be.ok

    expect(okx.key).to.be.ok
    expect(okx.balance).to.be.ok
    expect(okx.order).to.be.ok

    expect(okx.specs).to.be.ok
    expect(okx.settings).to.deep.eq(okx.settings)

  })

})
