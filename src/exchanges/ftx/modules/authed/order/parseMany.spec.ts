import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { FtxOrderTypeEnum } from '../../../enums/FtxOrderTypeEnum'
import { FtxTriggerOrderTypeEnum } from '../../../enums/FtxTriggerOrderTypeEnum'
import { FtxAuthed } from '../../../FtxAuthed'
import {
  FTX_RAW_ORDERS,
  FTX_TRIGGER_RAW_ORDERS,
} from '../../../test/fixtures/ftxOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Ftx raw orders just fine', async () => {

    // preparing data
    const parsedOrders = PARSED_ORDERS.slice(0, 2)

    const rawOrdinaryOrder = cloneDeep(FTX_RAW_ORDERS[0])
    const rawTriggerOrders = cloneDeep(FTX_TRIGGER_RAW_ORDERS.slice(0, 2))
    rawTriggerOrders[1].orderType = FtxOrderTypeEnum.LIMIT
    rawTriggerOrders[1].type = FtxTriggerOrderTypeEnum.TAKE_PROFIT

    const rawOrders = [
      rawOrdinaryOrder,
      ...rawTriggerOrders,
    ]


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedOrders, (order, index) => {
      parse.onCall(index).returns({ order })
    })


    // executing
    const exchange = new FtxAuthed({ credentials })
    const { orders } = exchange.order.parseMany({ rawOrders })


    // validating
    expect(orders).to.deep.eq(parsedOrders)

    expect(parse.callCount).to.be.eq(parsedOrders.length)

  })

})
