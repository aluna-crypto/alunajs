import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { ValrAuthed } from '../../../ValrAuthed'
import { VALR_RAW_ORDERS } from '../../../test/fixtures/valrOrders'



describe.skip(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Valr raw order just fine', async () => {

    // preparing data
    const rawOrder = VALR_RAW_ORDERS[0]

    const exchange = new ValrAuthed({ credentials })

    const { order } = exchange.order.parse({ rawOrder })

    expect(order).to.deep.eq(rawOrder)

  })

})
