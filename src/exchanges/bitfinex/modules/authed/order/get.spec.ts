import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { mockOrderGetRaw } from '../../../../../../test/mocks/exchange/modules/order/mockOrderGetRaw'
import { IAlunaOrderGetParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { BITFINEX_RAW_ORDERS } from '../../../test/fixtures/bitfinexOrders'
import * as getRawMod from './getRaw'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Bitfinex order just fine', async () => {

    // preparing data
    const mockedRawOrder = BITFINEX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const [id] = mockedRawOrder

    const params: IAlunaOrderGetParams = {
      id: id.toString(),
      symbolPair: '',
    }


    // mocking
    const { getRaw } = mockOrderGetRaw({ module: getRawMod })
    getRaw.returns(Promise.resolve({ rawOrder: mockedRawOrder }))

    const { parse } = mockParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { order } = await exchange.order.get(params)


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(getRaw.callCount).to.be.eq(1)
    expect(getRaw.firstCall.args[0]).to.deep.eq({
      ...params,
      http: new BitfinexHttp({}),
    })

    expect(parse.callCount).to.be.eq(1)
    expect(parse.firstCall.args[0]).to.deep.eq({
      rawOrder: mockedRawOrder,
    })

  })

})
