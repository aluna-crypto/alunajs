import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { FtxAuthed } from '../../../FtxAuthed'
import { IFtxKeySchema } from '../../../schemas/IFtxKeySchema'
import { FTX_KEY_PERMISSIONS } from '../../../test/fixtures/ftxKey'



describe(__filename, () => {

  it('should parse Ftx key permissions just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const rawKey: IFtxKeySchema = FTX_KEY_PERMISSIONS


    // executing
    const exchange = new FtxAuthed({ credentials })

    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions.read).to.be.ok
    expect(permissions.trade).not.to.be.ok
    expect(permissions.withdraw).to.be.ok

  })

  it('should parse Ftx key permissions just fine w/ readOnly', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const rawKey: IFtxKeySchema = cloneDeep(FTX_KEY_PERMISSIONS)

    rawKey.readOnly = false
    rawKey.withdrawalEnabled = false

    // executing
    const exchange = new FtxAuthed({ credentials })

    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions.read).to.be.ok
    expect(permissions.trade).to.be.ok
    expect(permissions.withdraw).not.to.be.ok

  })

})
