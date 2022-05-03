import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { SampleAuthed } from './SampleAuthed'



describe(__filename, () => {

  it('should ensure exchange have all properties and methods', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '666',
    }

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const sample = new SampleAuthed({
      credentials,
      settings,
    })

    expect(sample.id).to.eq('sample')
    expect(sample.symbol).to.be.ok
    expect(sample.market).to.be.ok
    expect(sample.key).to.be.ok
    expect(sample.balance).to.be.ok
    expect(sample.order).to.be.ok
    expect(sample.specs).to.be.ok
    expect(sample.settings).to.deep.eq(settings)
    expect(sample.credentials).to.deep.eq(credentials)

  })

})
