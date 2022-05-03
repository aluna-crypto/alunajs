import { expect } from 'chai'
import { omit } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { SampleAuthed } from '../../../SampleAuthed'
import { ISampleKeySchema } from '../../../schemas/ISampleKeySchema'



describe(__filename, () => {

  it('should parse Sample key permissions just fine', async () => {

    // preparing data
    const accountId = 'accountId'

    const rawKey: ISampleKeySchema = {
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

    const exchange = new SampleAuthed({ credentials })


    // executing
    const { key } = await exchange.key.parsePermissions({ rawKey })


    // validating
    expect(key).to.deep.eq(omit(rawKey, 'accountId'))

  })

})
