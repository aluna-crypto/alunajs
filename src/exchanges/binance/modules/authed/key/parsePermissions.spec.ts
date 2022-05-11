import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { BinanceApiKeyPermissionsEnum } from '../../../enums/BinanceApiKeyPermissionsEnum'
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

  it('should parse Binance key permissions just fine w/o permissions', async () => {

    // preparing data
    const rawKey: IBinanceKeySchema = cloneDeep(BINANCE_KEY_PERMISSIONS)

    rawKey.permissions = [
      'unknown' as BinanceApiKeyPermissionsEnum,
    ]

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const expectedPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    const exchange = new BinanceAuthed({ credentials })


    // executing
    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions).to.deep.eq(expectedPermissions)

  })

})
