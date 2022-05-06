import { expect } from 'chai'
import { omit } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { GateAuthed } from '../../../GateAuthed'
import { IGateKeySchema } from '../../../schemas/IGateKeySchema'



describe(__filename, () => {

  it('should parse Gate key permissions just fine', async () => {

    // preparing data
    const accountId = 'accountId'

    const rawKey: IGateKeySchema = {
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

    const exchange = new GateAuthed({ credentials })


    // executing
    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions).to.deep.eq(omit(rawKey, 'accountId'))

  })

})
