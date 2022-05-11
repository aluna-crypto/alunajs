import { expect } from 'chai'
import { omit } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { IBitmexKeySchema } from '../../../schemas/IBitmexKeySchema'



describe(__filename, () => {

  it('should parse Bitmex key permissions just fine', async () => {

    // preparing data
    const accountId = 'accountId'

    const rawKey: IBitmexKeySchema = {
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

    const exchange = new BitmexAuthed({ credentials })


    // executing
    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions).to.deep.eq(omit(rawKey, 'accountId'))

  })

})
