import { expect } from 'chai'
import { omit } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { IBinanceKeySchema } from '../../../schemas/IBinanceKeySchema'



describe(__filename, () => {

  it('should parse Binance key permissions just fine', async () => {

    // preparing data
    const accountId = 'accountId'

    const rawKey: IBinanceKeySchema = {
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

    const exchange = new BinanceAuthed({ credentials })


    // executing
    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions).to.deep.eq(omit(rawKey, 'accountId'))

  })

})
