import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { IHuobiOrdersResponseSchema } from '../../../schemas/IHuobiOrderSchema'
import { HUOBI_RAW_ORDERS } from '../../../test/fixtures/huobiOrders'
import { HUOBI_RAW_SYMBOLS } from '../../../test/fixtures/huobiSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Huobi raw orders just fine', async () => {

    // preparing data
    const parsedOrders = PARSED_ORDERS
    const huobiOrders = HUOBI_RAW_ORDERS
    const rawSymbols = HUOBI_RAW_SYMBOLS

    const rawOrders: IHuobiOrdersResponseSchema = {
      huobiOrders,
      rawSymbols,
    }

    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedOrders, (order, index) => {
      parse.onCall(index).returns({ order })
    })

    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { orders } = exchange.order.parseMany({
      rawOrders,
    })

    // validating
    expect(orders).to.deep.eq(parsedOrders)

    expect(parse.callCount).to.be.eq(huobiOrders.length)

  })

})
