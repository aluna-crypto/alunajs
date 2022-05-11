import { expect } from 'chai'
import { each } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BITMEX_RAW_PERMISSIONS } from '../../../test/fixtures/bitmexKey'



describe(__filename, () => {

  it('should parse Bitmex key permissions just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const expectedPermissions: IAlunaKeyPermissionSchema[] = [
      { read: true, withdraw: false, trade: false },
      { read: true, trade: false, withdraw: true },
      { read: true, trade: true, withdraw: false },
    ]


    // executing
    const exchange = new BitmexAuthed({ credentials })

    each(BITMEX_RAW_PERMISSIONS, (rawPermission, i) => {

      const { permissions } = exchange.key.parsePermissions({
        rawKey: rawPermission,
      })


      // validating
      expect(permissions).to.deep.eq(expectedPermissions[i])

    })

  })

})
