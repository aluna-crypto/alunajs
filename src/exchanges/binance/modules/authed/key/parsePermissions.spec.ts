import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { IBinanceKeySchema } from '../../../schemas/IBinanceKeySchema'
import { BINANCE_KEY_PERMISSIONS } from '../../../test/fixtures/binanceKey'



describe(__filename, () => {

  it('should parse Binance key permissions just fine', async () => {

    // preparing data
    const rawKey: IBinanceKeySchema = BINANCE_KEY_PERMISSIONS

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const expectedPermissions: IAlunaKeyPermissionSchema = {
      read: true,
      trade: true,
      withdraw: true,
    }

    const exchange = new BinanceAuthed({ credentials })


    // executing
    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions).to.deep.eq(expectedPermissions)

  })

})
