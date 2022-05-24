import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { FtxAuthed } from './FtxAuthed'



describe(__filename, () => {

  it('should contain public & authed modules', async () => {

    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
    }

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const ftx = new FtxAuthed({ settings, credentials })

    expect(ftx.id).to.eq('ftx')

    expect(ftx.symbol).to.be.ok
    expect(ftx.market).to.be.ok

    expect(ftx.key).to.be.ok
    expect(ftx.balance).to.be.ok
    expect(ftx.order).to.be.ok

    expect(ftx.specs).to.be.ok
    expect(ftx.settings).to.deep.eq(ftx.settings)

  })

})
