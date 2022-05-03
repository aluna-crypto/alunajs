import { expect } from 'chai'

import { mockOrderListRaw } from '../../../../../../test/mocks/exchange/modules/order/mockOrderListRaw'
import { mockOrderParseMany } from '../../../../../../test/mocks/exchange/modules/order/mockOrderParseMany'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { SampleAuthed } from '../../../SampleAuthed'
import { SampleHttp } from '../../../SampleHttp'
import {
  SAMPLE_PARSED_ORDERS,
  SAMPLE_RAW_ORDERS,
} from '../../../test/fixtures/sampleOrders'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Sample orders just fine', async () => {

    // preparing data
    const http = new SampleHttp()

    const mockedRawOrders = SAMPLE_RAW_ORDERS
    const mockedParsedOrders = SAMPLE_PARSED_ORDERS


    // mocking
    const { listRaw } = mockOrderListRaw({ module: listRawMod })

    listRaw.returns(Promise.resolve({ rawOrders: mockedRawOrders }))

    const { parseMany } = mockOrderParseMany({ module: parseManyMod })

    parseMany.returns({ orders: mockedParsedOrders })


    // executing
    const exchange = new SampleAuthed({ credentials })

    const { orders } = await exchange.order.list()


    // validating
    expect(orders).to.deep.eq(mockedParsedOrders)

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.firstCall.args[0]).to.deep.eq({
      http,
    })

    expect(parseMany.callCount).to.be.eq(1)
    expect(parseMany.firstCall.args[0]).to.deep.eq({
      rawOrders: mockedRawOrders,
    })

  })

})
