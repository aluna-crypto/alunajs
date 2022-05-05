import { expect } from 'chai'
import { omit } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IValrKeySchema } from '../../../schemas/IValrKeySchema'
import { ValrAuthed } from '../../../ValrAuthed'



describe(__filename, () => {

  it('should parse Valr key permissions just fine', async () => {

    // preparing data
    const accountId = 'accountId'

    const rawKey: IValrKeySchema = {
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

    const exchange = new ValrAuthed({ credentials })


    // executing
    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions).to.deep.eq(omit(rawKey, 'accountId'))

  })

})
