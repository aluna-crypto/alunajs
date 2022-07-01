import { expect } from 'chai'

import { mockParsePermissions } from '../../../../../../test/mocks/exchange/modules/key/mockParsePermissions'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { IHuobiRawKeySchema } from '../../../schemas/IHuobiKeySchema'
import * as mockParsePermissionsMod from './parsePermissions'



describe(__filename, () => {

  it('should parse Huobi key details just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const accountId = 123456

    const mockRest = {} as any

    const rawKey: IHuobiRawKeySchema = {
      accountId,
      ...mockRest,
    }

    const permissions: IAlunaKeyPermissionSchema = {
      read: true,
      trade: true,
      withdraw: true,
    }

    // mocking
    const { parsePermissions } = mockParsePermissions({
      module: mockParsePermissionsMod,
    })

    parsePermissions.returns({ permissions })


    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { key } = exchange.key.parseDetails({ rawKey })


    // validating
    expect(key).to.deep.eq({
      accountId: accountId.toString(),
      permissions,
      meta: rawKey,
    })

    expect(parsePermissions.callCount).to.be.eq(1)
    expect(parsePermissions.firstCall.args[0]).to.deep.eq({
      rawKey,
    })

  })

})
