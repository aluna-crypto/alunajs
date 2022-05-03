import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { BittrexAuthed } from './BittrexAuthed'



describe(__filename, () => {

  it('should ensure exchange have all properties and methods', async () => {

    const settings: IAlunaSettingsSchema = {
      referralCode: '666',
    }

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const bittrex = new BittrexAuthed({
      credentials,
      settings,
    })

    expect(bittrex.id).to.eq('bittrex')
    expect(bittrex.symbol).to.be.ok
    expect(bittrex.market).to.be.ok
    expect(bittrex.key).to.be.ok
    expect(bittrex.balance).to.be.ok
    expect(bittrex.order).to.be.ok
    expect(bittrex.specs).to.be.ok
    expect(bittrex.settings).to.deep.eq(settings)
    expect(bittrex.credentials).to.deep.eq(credentials)

  })

})
