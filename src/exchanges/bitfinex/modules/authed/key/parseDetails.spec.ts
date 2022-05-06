import { expect } from 'chai'

import { mockParsePermissions } from '../../../../../../test/mocks/exchange/modules/key/mockParsePermissions'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { IBitfinexKeySchema } from '../../../schemas/IBitfinexKeySchema'
import { BITFINEX_KEY_PERMISSIONS } from '../../../test/fixtures/bitfinexKey'
import * as mockParsePermissionsMod from './parsePermissions'



describe(__filename, () => {

  it('should parse Bitfinex key details just fine', async () => {

    // preparing data
    const accountId = 'accountId'

    const rawKey: IBitfinexKeySchema = {
      accountId,
      permissionsScope: BITFINEX_KEY_PERMISSIONS,
    }

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const permissions: IAlunaKeyPermissionSchema = {
      read: true,
      trade: true,
    }


    // mocking
    const { parsePermissions } = mockParsePermissions({
      module: mockParsePermissionsMod,
    })

    parsePermissions.returns({ permissions })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { key } = exchange.key.parseDetails({ rawKey })


    // validating
    expect(key).to.deep.eq({
      accountId,
      permissions,
      meta: rawKey,
    })

    expect(parsePermissions.callCount).to.be.eq(1)
    expect(parsePermissions.firstCall.args[0]).to.deep.eq({
      rawKey,
    })

  })

})
