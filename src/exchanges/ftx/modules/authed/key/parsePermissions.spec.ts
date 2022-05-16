import { expect } from 'chai'
import { omit } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { FtxAuthed } from '../../../FtxAuthed'
import { IFtxKeySchema } from '../../../schemas/IFtxKeySchema'



describe(__filename, () => {

  it('should parse Ftx key permissions just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const accountId = 'accountId'

    const rawKey: IFtxKeySchema = {
      accountId,
      read: false,
      trade: false,
      withdraw: false,
    }


    // executing
    const exchange = new FtxAuthed({ credentials })

    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions).to.deep.eq(omit(rawKey, 'accountId'))

  })

})
