import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { OkxAuthed } from '../../../OkxAuthed'
import { OKX_RAW_ORDERS } from '../../../test/fixtures/okxOrders'



describe.skip(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Okx raw order just fine', async () => {

    // preparing data
    const rawOrder = OKX_RAW_ORDERS[0]

    const exchange = new OkxAuthed({ credentials })

    const { order } = exchange.order.parse({ rawOrder })


    // validating
    expect(order).to.exist

    // TODO: add expectations for everything
    // expect(order).to.deep.eq(...)

  })

})
