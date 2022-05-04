import { expect } from 'chai'
import { each } from 'lodash'

import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BittrexAuthed } from '../../../BittrexAuthed'
import {
  BITTREX_PARSED_ORDERS,
  BITTREX_RAW_ORDERS,
} from '../../../test/fixtures/bittrexOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Bittrex raw orders just fine', async () => {

    // preparing data
    const parsedOrders = BITTREX_PARSED_ORDERS
    const rawOrders = BITTREX_RAW_ORDERS


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedOrders, (order, index) => {
      parse.onCall(index).returns({ order })
    })


    // executing
    const exchange = new BittrexAuthed({ credentials })

    const { orders } = exchange.order.parseMany({ rawOrders })


    // validating
    expect(orders).to.deep.eq(parsedOrders)

    expect(parse.callCount).to.be.eq(rawOrders.length)

  })

})
