import { expect } from 'chai'
import { omit } from 'lodash'

import {
  mockParsePermissions,
} from '../../../../../../test/mocks/exchange/modules/key/mockParsePermissions'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import {
  IAlunaKeyPermissionSchema,
} from '../../../../../lib/schemas/IAlunaKeySchema'
import {
  Bittrex,
} from '../../../Bittrex'
import { IBittrexKeySchema } from '../../../schemas/IBittrexKeySchema'
import * as mockParsePermissionsMod from './parsePermissions'



describe(__filename, () => {

  it('should parse Bittrex key details just fine', async () => {

    // preparing data
    const accountId = 'accountId'

    const rawKey: IBittrexKeySchema = {
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

    const exchange = new Bittrex({ settings: {} })
    const auth = await exchange.auth(credentials)

    const rawKeyWithoutAccId = omit(rawKey, 'accountId')

    const permissions: IAlunaKeyPermissionSchema = {
      ...rawKeyWithoutAccId,
    }


    // mocking
    const { parsePermissions } = mockParsePermissions({
      module: mockParsePermissionsMod,
    })

    parsePermissions.returns(Promise.resolve({ key: permissions }))


    // executing
    const { key } = await auth.key.parseDetails({ rawKey })


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
