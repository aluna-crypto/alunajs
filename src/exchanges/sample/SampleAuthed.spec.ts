import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { SampleAuthed } from './SampleAuthed'



describe(__filename, () => {

  it('should ensure exchangehave all properties and methods', async () => {

    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
    }

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const sample = new SampleAuthed({ settings, credentials })

    expect(sample.id).to.eq('sample')

    expect(sample.symbol).to.be.ok
    expect(sample.market).to.be.ok

    expect(sample.key).to.be.ok
    expect(sample.balance).to.be.ok
    expect(sample.order).to.be.ok
    expect(sample.position).to.be.ok

    expect(sample.specs).to.be.ok
    expect(sample.settings).to.deep.eq(settings)

  })

})
