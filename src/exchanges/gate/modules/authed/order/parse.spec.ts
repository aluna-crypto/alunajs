import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { GateAuthed } from '../../../GateAuthed'
import { GATE_RAW_ORDERS } from '../../../test/fixtures/gateOrders'



describe.skip(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Gate raw order just fine', async () => {

    // preparing data
    const rawOrder = GATE_RAW_ORDERS[0]

    const exchange = new GateAuthed({ credentials })

    const { order } = exchange.order.parse({ rawOrder })

    expect(order).to.deep.eq(rawOrder)

  })

})
