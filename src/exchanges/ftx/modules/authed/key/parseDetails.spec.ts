import { expect } from 'chai'

import { mockParsePermissions } from '../../../../../../test/mocks/exchange/modules/key/mockParsePermissions'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { FtxAuthed } from '../../../FtxAuthed'
import { IFtxKeySchema } from '../../../schemas/IFtxKeySchema'
import { FTX_KEY_PERMISSIONS } from '../../../test/fixtures/ftxKey'
import * as mockParsePermissionsMod from './parsePermissions'



describe(__filename, () => {

  it('should parse Ftx key details just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const rawKey: IFtxKeySchema = FTX_KEY_PERMISSIONS

    const {
      account: {
        accountIdentifier,
      },
    } = rawKey

    // mocking
    const { parsePermissions } = mockParsePermissions({
      module: mockParsePermissionsMod,
    })

    parsePermissions.returns({ permissions: rawKey })


    // executing
    const exchange = new FtxAuthed({ credentials })

    const { key } = exchange.key.parseDetails({ rawKey })


    // validating
    expect(key).to.deep.eq({
      accountId: accountIdentifier.toString(),
      permissions: rawKey,
      meta: rawKey,
    })

    expect(parsePermissions.callCount).to.be.eq(1)
    expect(parsePermissions.firstCall.args[0]).to.deep.eq({
      rawKey,
    })

  })

})
