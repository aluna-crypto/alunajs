import { expect } from 'chai'
import { omit } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { IBitfinexKeySchema } from '../../../schemas/IBitfinexKeySchema'



describe(__filename, () => {

  it('should parse Bitfinex key permissions just fine', async () => {

    // preparing data
    const accountId = 'accountId'

    const rawKey: IBitfinexKeySchema = {
      read: false,
      trade: false,
      withdraw: false,
      accountId,
    }

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const exchange = new BitfinexAuthed({ credentials })


    // executing
    const { key } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(key).to.deep.eq(omit(rawKey, 'accountId'))

  })

})
