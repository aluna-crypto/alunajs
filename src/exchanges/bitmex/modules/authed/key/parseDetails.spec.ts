import { expect } from 'chai'
import {
  cloneDeep,
  omit,
} from 'lodash'

import { PARSED_PERMISSIONS } from '../../../../../../test/fixtures/parsedKey'
import { mockParsePermissions } from '../../../../../../test/mocks/exchange/modules/key/mockParsePermissions'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import {
  BITMEX_RAW_KEY,
  BITMEX_RAW_PERMISSIONS,
} from '../../../test/fixtures/bitmexKey'
import * as mockParsePermissionsMod from './parsePermissions'



describe(__filename, () => {

  it('should parse Bitmex key details just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const mockedRawPermissions = BITMEX_RAW_PERMISSIONS[0]
    const mockedPermissions = PARSED_PERMISSIONS

    const rawKey = cloneDeep([BITMEX_RAW_KEY])
    rawKey[0].id = credentials.key
    rawKey[0].permissions = mockedRawPermissions


    // mocking
    const { parsePermissions } = mockParsePermissions({
      module: mockParsePermissionsMod,
    })
    parsePermissions.returns({ permissions: mockedPermissions })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const { key } = exchange.key.parseDetails({ rawKey })


    // validating
    expect(key).to.deep.eq({
      accountId: rawKey[0].userId.toString(),
      permissions: mockedPermissions,
      meta: omit(rawKey[0], 'secret', 'id'),
    })

    expect(parsePermissions.callCount).to.be.eq(1)
    expect(parsePermissions.firstCall.args[0]).to.deep.eq({
      rawKey: mockedRawPermissions,
    })

  })

})
