import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BITMEX_RAW_ORDERS } from '../../../test/fixtures/bitmexOrders'



describe.skip(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Bitmex raw order just fine', async () => {

    // preparing data
    const rawOrder = BITMEX_RAW_ORDERS[0]

    const exchange = new BitmexAuthed({ credentials })

    const { order } = exchange.order.parse({ rawOrder })


    // validating
    expect(order).to.exist

    // TODO: add expectations for everything
    // expect(order).to.deep.eq(...)

  })

})
