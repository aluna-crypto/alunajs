import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { VALR_RAW_CURRENCY_PAIRS } from '../../../test/fixtures/valrMarket'
import { VALR_RAW_LIST_RESPONSE_ORDERS } from '../../../test/fixtures/valrOrders'
import { ValrAuthed } from '../../../ValrAuthed'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Valr raw orders just fine', async () => {

    // preparing data
    const parsedOrders = PARSED_ORDERS
    const valrOrders = VALR_RAW_LIST_RESPONSE_ORDERS.slice(0, 2)
    const rawCurrencyPairs = VALR_RAW_CURRENCY_PAIRS

    const rawOrders = {
      valrOrders,
      rawCurrencyPairs,
    }


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedOrders, (order, index) => {
      parse.onCall(index).returns({ order })
    })


    // executing
    const exchange = new ValrAuthed({ credentials })

    const { orders } = exchange.order.parseMany({ rawOrders })


    // validating
    expect(orders).to.deep.eq(parsedOrders)

    expect(parse.callCount).to.be.eq(orders.length)

  })

})
