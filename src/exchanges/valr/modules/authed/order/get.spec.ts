import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockGetRaw } from '../../../../../../test/mocks/exchange/modules/mockGetRaw'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaOrderGetParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { VALR_RAW_LIST_RESPONSE_ORDERS } from '../../../test/fixtures/valrOrders'
import { ValrAuthed } from '../../../ValrAuthed'
import * as getRawMod from './getRaw'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Valr order just fine', async () => {

    // preparing data
    const mockedRawOrder = VALR_RAW_LIST_RESPONSE_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const { orderId } = mockedRawOrder

    const params: IAlunaOrderGetParams = {
      id: orderId,
      symbolPair: '',
    }


    // mocking
    const { getRaw } = mockGetRaw({ module: getRawMod })

    getRaw.returns(Promise.resolve({ rawOrder: mockedRawOrder }))

    const { parse } = mockParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })


    // executing
    const exchange = new ValrAuthed({ credentials })

    const { order } = await exchange.order.get({
      id: orderId,
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
