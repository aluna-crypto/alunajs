import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { binanceAuthed } from '../../../binanceAuthed'
import { BINANCE_RAW_ORDERS } from '../../../test/fixtures/binanceOrders'



describe.skip(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a binance raw order just fine', async () => {

    // preparing data
    const rawOrder = BINANCE_RAW_ORDERS[0]

    const exchange = new binanceAuthed({ credentials })

    const { order } = exchange.order.parse({ rawOrder })


    // validating
    expect(order).to.exist

    // TODO: add expectations for everything
    // expect(order).to.deep.eq(...)

  })

})
