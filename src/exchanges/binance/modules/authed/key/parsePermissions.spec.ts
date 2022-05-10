import { expect } from 'chai'
import { omit } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { binanceAuthed } from '../../../binanceAuthed'
import { IbinanceKeySchema } from '../../../schemas/IbinanceKeySchema'



describe(__filename, () => {

  it('should parse binance key permissions just fine', async () => {

    // preparing data
    const accountId = 'accountId'

    const rawKey: IbinanceKeySchema = {
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

    const exchange = new binanceAuthed({ credentials })


    // executing
    const { permissions } = exchange.key.parsePermissions({ rawKey })


    // validating
    expect(permissions).to.deep.eq(omit(rawKey, 'accountId'))

  })

})
