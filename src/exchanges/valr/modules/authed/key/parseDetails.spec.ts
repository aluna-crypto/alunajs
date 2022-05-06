import { expect } from 'chai'

import { mockParsePermissions } from '../../../../../../test/mocks/exchange/modules/key/mockParsePermissions'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { ValrAuthed } from '../../../ValrAuthed'
import { IValrKeySchema } from '../../../schemas/IValrKeySchema'
import * as mockParsePermissionsMod from './parsePermissions'
import { VALR_KEY_PERMISSIONS } from '../../../test/fixtures/valrKey'



describe(__filename, () => {

  it('should parse Valr key details just fine', async () => {

    // preparing data

    const rawKey: IValrKeySchema = VALR_KEY_PERMISSIONS

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const permissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }


    // mocking
    const { parsePermissions } = mockParsePermissions({
      module: mockParsePermissionsMod,
    })

    parsePermissions.returns({ key: permissions })


    // executing
    const exchange = new ValrAuthed({ credentials })

    const { key } = exchange.key.parseDetails({ rawKey })


    // validating
    expect(key).to.deep.eq({
      accountId: undefined,
      permissions,
      meta: rawKey,
    })

    expect(parsePermissions.callCount).to.be.eq(1)
    expect(parsePermissions.firstCall.args[0]).to.deep.eq({
      rawKey,
    })

  })

})
