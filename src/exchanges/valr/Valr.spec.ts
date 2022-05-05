import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { ValrAuthed } from './ValrAuthed'



describe(__filename, () => {

  it('should ensure exchange have all properties and methods', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '666',
    }

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const valr = new ValrAuthed({
      credentials,
      settings,
    })

    expect(valr.id).to.eq('valr')
    expect(valr.symbol).to.be.ok
    expect(valr.market).to.be.ok
    expect(valr.key).to.be.ok
    expect(valr.balance).to.be.ok
    expect(valr.order).to.be.ok
    expect(valr.specs).to.be.ok
    expect(valr.settings).to.deep.eq(settings)
    expect(valr.credentials).to.deep.eq(credentials)

  })

})
