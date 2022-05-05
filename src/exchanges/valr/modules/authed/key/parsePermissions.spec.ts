import { expect } from 'chai'
import { omit } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { ValrAuthed } from '../../../ValrAuthed'
import { IValrKeySchema } from '../../../schemas/IValrKeySchema'



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
    const { key } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(key).to.deep.eq(omit(rawKey, 'accountId'))

  })

})
