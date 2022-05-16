import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { FtxAuthed } from '../../../FtxAuthed'
import { FTX_RAW_ORDERS } from '../../../test/fixtures/ftxOrders'



describe.skip(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Ftx raw order just fine', async () => {

    // preparing data
    const rawOrder = FTX_RAW_ORDERS[0]

    const exchange = new FtxAuthed({ credentials })

    const { order } = exchange.order.parse({ rawOrder })


    // validating
    expect(order).to.exist

    // TODO: add expectations for everything
    // expect(order).to.deep.eq(...)

  })

})
