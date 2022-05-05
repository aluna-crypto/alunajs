import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BITFINEX_RAW_KEY } from '../../../test/fixtures/bitfinexKey'



describe(__filename, () => {

  it('should parse Bitfinex key permissions just fine', async () => {

    // preparing data
    const rawKey = BITFINEX_RAW_KEY

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    const expectedPermission: IAlunaKeyPermissionSchema = {
      read: true,
      trade: true,
      withdraw: false,
    }

    expect(permissions).to.deep.eq(expectedPermission)

  })

})
