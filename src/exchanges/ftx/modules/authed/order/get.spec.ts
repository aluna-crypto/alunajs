import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockGetRaw } from '../../../../../../test/mocks/exchange/modules/mockGetRaw'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaOrderGetParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { FtxAuthed } from '../../../FtxAuthed'
import { FTX_RAW_ORDERS } from '../../../test/fixtures/ftxOrders'
import * as getRawMod from './getRaw'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Ftx order just fine', async () => {

    // preparing data
    const mockedRawOrder = FTX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const { id } = mockedRawOrder

    const params: IAlunaOrderGetParams = {
      id: id.toString(),
      symbolPair: '',
    }


    // mocking
    const { getRaw } = mockGetRaw({ module: getRawMod })

    getRaw.returns(Promise.resolve({ rawOrder: mockedRawOrder }))

    const { parse } = mockParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })


    // executing
    const exchange = new FtxAuthed({ credentials })

    const { order } = await exchange.order.get({
      id: id.toString(),
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
