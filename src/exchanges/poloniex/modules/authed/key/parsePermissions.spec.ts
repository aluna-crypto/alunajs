import { expect } from 'chai'
import { omit } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { IPoloniexKeySchema } from '../../../schemas/IPoloniexKeySchema'



describe(__filename, () => {

  it('should parse Poloniex key permissions just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const accountId = 'accountId'

    const rawKey: IPoloniexKeySchema = {
      accountId,
      read: false,
      trade: false,
      withdraw: false,
    }


    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions).to.deep.eq(omit(rawKey, 'accountId'))

  })

})
