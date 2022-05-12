import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { POLONIEX_RAW_ORDERS } from '../../../test/fixtures/poloniexOrders'



describe.skip(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Poloniex raw order just fine', async () => {

    // preparing data
    const rawOrder = POLONIEX_RAW_ORDERS[0]

    const exchange = new PoloniexAuthed({ credentials })

    const { order } = exchange.order.parse({ rawOrder })


    // validating
    expect(order).to.exist

    // TODO: add expectations for everything
    // expect(order).to.deep.eq(...)

  })

})
