import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { ValrAuthed } from './ValrAuthed'



describe(__filename, () => {

  it('should contain public & authed modules', async () => {

    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
    }

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const valr = new ValrAuthed({ settings, credentials })

    expect(valr.id).to.eq('sample')

    expect(valr.symbol).to.be.ok
    expect(valr.market).to.be.ok

    expect(valr.key).to.be.ok
    expect(valr.balance).to.be.ok
    expect(valr.order).to.be.ok

    expect(valr.specs).to.be.ok
    expect(valr.settings).to.deep.eq(settings)

  })

})
