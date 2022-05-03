import { expect } from 'chai'

import { mockOrderGetRaw } from '../../../../../../test/mocks/exchange/modules/order/mockOrderGetRaw'
import { mockOrderParse } from '../../../../../../test/mocks/exchange/modules/order/mockOrderParse'
import { IAlunaOrderGetParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BittrexAuthed } from '../../../BittrexAuthed'
import {
  BITTREX_PARSED_ORDERS,
  BITTREX_RAW_ORDERS,
} from '../../../test/fixtures/bittrexOrders'
import * as getRawMod from './getRaw'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Bittrex order just fine', async () => {

    // preparing data
    const mockedRawOrder = BITTREX_RAW_ORDERS[0]
    const mockedParsedOrder = BITTREX_PARSED_ORDERS[0]

    const { id } = mockedRawOrder

    const params: IAlunaOrderGetParams = {
      id,
      symbolPair: '',
    }


    // mocking
    const { getRaw } = mockOrderGetRaw({ module: getRawMod })

    getRaw.returns(Promise.resolve({ rawOrder: mockedRawOrder }))

    const { parse } = mockOrderParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })


    // executing
    const exchange = new BittrexAuthed({ credentials })

    const { order } = await exchange.order.get({
      id,
      symbolPair: '',
    })


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(getRaw.callCount).to.be.eq(1)
    expect(getRaw.firstCall.args[0]).to.deep.eq(params)

    expect(parse.callCount).to.be.eq(1)
    expect(parse.firstCall.args[0]).to.deep.eq({
      rawOrder: mockedRawOrder,
    })

  })

})