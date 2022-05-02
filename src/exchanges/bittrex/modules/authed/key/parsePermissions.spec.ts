import { expect } from 'chai'
import { omit } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BittrexAuthed } from '../../../BittrexAuthed'
import { IBittrexKeySchema } from '../../../schemas/IBittrexKeySchema'



describe(__filename, () => {

  it('should parse key permissions just fine', async () => {

    // preparing data
    const accountId = 'accountId'

    const rawKey: IBittrexKeySchema = {
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

    const exchange = new BittrexAuthed({ credentials })


    // executing
    const { key } = await exchange.key.parsePermissions({ rawKey })


    // validating
    expect(key).to.deep.eq(omit(rawKey, 'accountId'))

  })

})
