import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { GateAuthed } from '../../../GateAuthed'
import { IGateOrderListResponseSchema } from '../../../schemas/IGateOrderSchema'
import { GATE_RAW_ORDERS } from '../../../test/fixtures/gateOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Gate raw orders just fine', async () => {

    // preparing data
    const parsedOrders = PARSED_ORDERS
    const rawOrders = GATE_RAW_ORDERS
    const rawOrdersList: IGateOrderListResponseSchema[] = [
      {
        currency_pair: '',
        orders: rawOrders,
        total: 1,
      },
    ]


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedOrders, (order, index) => {
      parse.onCall(index).returns({ order })
    })


    // executing
    const exchange = new GateAuthed({ credentials })

    const { orders } = exchange.order.parseMany({ rawOrders: rawOrdersList })


    // validating
    expect(orders).to.deep.eq(parsedOrders)

    expect(parse.callCount).to.be.eq(rawOrders.length)

  })

})
