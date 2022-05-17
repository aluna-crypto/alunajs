import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { IBinanceOrdersResponseSchema } from '../../../schemas/IBinanceOrderSchema'
import { BINANCE_RAW_ORDERS } from '../../../test/fixtures/binanceOrders'
import { BINANCE_RAW_SYMBOLS } from '../../../test/fixtures/binanceSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Binance raw orders just fine', async () => {

    // preparing data
    const parsedOrders = PARSED_ORDERS.slice(0, 2)

    const spotOrders = BINANCE_RAW_ORDERS.slice(0, 1)
    const marginOrders = cloneDeep(BINANCE_RAW_ORDERS).slice(0, 2)
    marginOrders[0].isIsolated = true
    const binanceOrders = spotOrders.concat(marginOrders)

    const rawSymbols = BINANCE_RAW_SYMBOLS

    const rawOrders: IBinanceOrdersResponseSchema = {
      binanceOrders,
      rawSymbols,
    }

    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedOrders, (order, index) => {
      parse.onCall(index).returns({ order })
    })


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { orders } = exchange.order.parseMany({ rawOrders })


    // validating
    expect(orders).to.deep.eq(parsedOrders)

    expect(parse.callCount).to.be.eq(parsedOrders.length)

  })

})
