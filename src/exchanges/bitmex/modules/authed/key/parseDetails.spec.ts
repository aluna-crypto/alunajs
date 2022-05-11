import { expect } from 'chai'
import { omit } from 'lodash'

import { mockParsePermissions } from '../../../../../../test/mocks/exchange/modules/key/mockParsePermissions'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { IBitmexKeySchema } from '../../../schemas/IBitmexKeySchema'
import * as mockParsePermissionsMod from './parsePermissions'



describe(__filename, () => {

  it('should parse Bitmex key details just fine', async () => {

    // preparing data
    const accountId = 'accountId'

    const rawKey: IBitmexKeySchema = {
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

    const rawKeyWithoutAccId = omit(rawKey, 'accountId')

    const permissions: IAlunaKeyPermissionSchema = {
      ...rawKeyWithoutAccId,
    }


    // mocking
    const { parsePermissions } = mockParsePermissions({
      module: mockParsePermissionsMod,
    })

    parsePermissions.returns({ permissions })


    // executing
    const exchange = new BitmexAuthed({ credentials })

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
