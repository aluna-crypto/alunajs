import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { IHuobiKeySchema } from '../../../schemas/IHuobiKeySchema'



describe(__filename, () => {

  it('should parse Huobi key permissions just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const mockRest = {} as any

    const rawKey: IHuobiKeySchema = {
      ...mockRest,
      permission: 'trade,withdraw,readOnly,unknown',

    }

    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions.read).to.be.ok
    expect(permissions.trade).to.be.ok
    expect(permissions.withdraw).to.be.ok

  })

})
