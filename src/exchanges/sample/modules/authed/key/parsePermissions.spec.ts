import { expect } from 'chai'
import { omit } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { SampleAuthed } from '../../../SampleAuthed'
import { ISampleKeySchema } from '../../../schemas/ISampleKeySchema'



describe(__filename, () => {

  it('should parse Sample key permissions just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const accountId = 'accountId'

    const rawKey: ISampleKeySchema = {
      accountId,
      read: false,
      trade: false,
      withdraw: false,
    }


    // executing
    const exchange = new SampleAuthed({ credentials })

    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions).to.deep.eq(omit(rawKey, 'accountId'))

  })

})
