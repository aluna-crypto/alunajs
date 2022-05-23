import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { HuobiAuthed } from './HuobiAuthed'



describe(__filename, () => {

  it('should contain public & authed modules', async () => {

    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
    }

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const huobi = new HuobiAuthed({ settings, credentials })

    expect(huobi.id).to.eq('huobi')

    expect(huobi.symbol).to.be.ok
    expect(huobi.market).to.be.ok

    expect(huobi.key).to.be.ok
    expect(huobi.balance).to.be.ok
    expect(huobi.order).to.be.ok

    expect(huobi.specs).to.be.ok
    expect(huobi.settings).to.deep.eq(huobi.settings)

  })

})
