import { expect } from 'chai'

import { mockParsePermissions } from '../../../../../../test/mocks/exchange/modules/key/mockParsePermissions'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { IPoloniexKeySchema } from '../../../schemas/IPoloniexKeySchema'
import * as mockParsePermissionsMod from './parsePermissions'



describe(__filename, () => {

  it('should parse Poloniex key details just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const accountId = undefined

    const rawKey: IPoloniexKeySchema = {
      read: false,
    }

    // mocking
    const { parsePermissions } = mockParsePermissions({
      module: mockParsePermissionsMod,
    })

    parsePermissions.returns({ permissions: rawKey })


    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { key } = exchange.key.parseDetails({ rawKey })


    // validating
    expect(key).to.deep.eq({
      accountId,
      permissions: rawKey,
      meta: rawKey,
    })

    expect(parsePermissions.callCount).to.be.eq(1)
    expect(parsePermissions.firstCall.args[0]).to.deep.eq({
      rawKey,
    })

  })

})
