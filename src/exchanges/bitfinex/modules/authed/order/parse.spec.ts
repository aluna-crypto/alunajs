import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BITFINEX_RAW_ORDERS } from '../../../test/fixtures/bitfinexOrders'



describe.skip(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Bitfinex raw order just fine', async () => {

    // preparing data
    const rawOrder = BITFINEX_RAW_ORDERS[0]

    const exchange = new BitfinexAuthed({ credentials })

    const { order } = exchange.order.parse({ rawOrder })

    expect(order).to.deep.eq(rawOrder)

  })

})
