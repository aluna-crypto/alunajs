import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { PoloniexAuthed } from './PoloniexAuthed'



describe(__filename, () => {

  it('should contain public & authed modules', async () => {

    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
    }

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const poloniex = new PoloniexAuthed({ settings, credentials })

    expect(poloniex.id).to.eq('poloniex')

    expect(poloniex.symbol).to.be.ok
    expect(poloniex.market).to.be.ok

    expect(poloniex.key).to.be.ok
    expect(poloniex.balance).to.be.ok
    expect(poloniex.order).to.be.ok


    expect(poloniex.specs).to.be.ok
    expect(poloniex.settings).to.deep.eq(poloniex.settings)

  })

})
