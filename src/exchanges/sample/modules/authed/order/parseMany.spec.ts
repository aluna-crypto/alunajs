import { expect } from 'chai'
import { each } from 'lodash'

import { mockOrderParse } from '../../../../../../test/mocks/exchange/modules/order/mockOrderParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { SampleAuthed } from '../../../SampleAuthed'
import {
  SAMPLE_PARSED_ORDERS,
  SAMPLE_RAW_ORDERS,
} from '../../../test/fixtures/sampleOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Sample raw orders just fine', async () => {

    // preparing data
    const parsedOrders = SAMPLE_PARSED_ORDERS
    const rawOrders = SAMPLE_RAW_ORDERS


    // mocking
    const { parse } = mockOrderParse({ module: parseMod })

    each(parsedOrders, (order, index) => {
      parse.onCall(index).returns({ order })
    })


    // executing
    const exchange = new SampleAuthed({ credentials })

    const { orders } = exchange.order.parseMany({ rawOrders })


    // validating
    expect(orders).to.deep.eq(parsedOrders)

    expect(parse.callCount).to.be.eq(rawOrders.length)

  })

})
