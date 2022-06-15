import { expect } from 'chai'
import { omit } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { OkxAuthed } from '../../../OkxAuthed'
import { IOkxKeySchema } from '../../../schemas/IOkxKeySchema'



describe(__filename, () => {

  it('should parse Okx key permissions just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const accountId = 'accountId'

    const rawKey: IOkxKeySchema = {
      accountId,
      read: false,
      trade: false,
      withdraw: false,
    }


    // executing
    const exchange = new OkxAuthed({ credentials })

    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions).to.deep.eq(omit(rawKey, 'accountId'))

  })

})
