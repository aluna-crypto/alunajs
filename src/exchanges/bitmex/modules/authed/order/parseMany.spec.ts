import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { IBitmexOrdersSchema } from '../../../schemas/IBitmexOrderSchema'
import { BITMEX_RAW_ORDERS } from '../../../test/fixtures/bitmexOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Bitmex raw orders just fine', async () => {

    // preparing data
    const markets = PARSED_MARKETS

    const parsedOrders = PARSED_ORDERS.slice(0, 1)

    const bitmexOrders = cloneDeep(BITMEX_RAW_ORDERS.slice(0, 2))
    bitmexOrders[0].symbol = 'XBT_LINK' // should skip symbol for spot order

    const rawOrders: IBitmexOrdersSchema = {
      bitmexOrders,
      markets,
    }


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedOrders, (order, index) => {
      parse.onCall(index).returns({ order })
    })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const { orders } = exchange.order.parseMany({ rawOrders })


    // validating
    expect(orders).to.deep.eq(parsedOrders)

    expect(parse.callCount).to.be.eq(parsedOrders.length)

  })

})
