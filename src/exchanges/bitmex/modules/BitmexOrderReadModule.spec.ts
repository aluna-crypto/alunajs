import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { BitmexHttp } from '../BitmexHttp'
import {
  BITMEX_PARSED_ORDERS,
  BITMEX_RAW_ORDERS,
} from '../test/bitmexOrders'
import { BitmexOrderReadModule } from './BitmexOrderReadModule'



describe.only('BitmexOrderReadModule', () => {

  const bitmexOrderReadModule = BitmexOrderReadModule.prototype

  const mockExchange = () => {

    const exchangeMock = ImportMock.mockOther(
      bitmexOrderReadModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    return { exchangeMock }

  }

  it('should list Bitmex raw orders just fine', async () => {

    const { exchangeMock } = mockExchange()

    const requestMock = ImportMock.mockFunction(
      BitmexHttp,
      'privateRequest',
      Promise.resolve(BITMEX_RAW_ORDERS),
    )

    const rawBalances = await bitmexOrderReadModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://bitmex.com/api/v1/order',
      keySecret: exchangeMock.getValue().keySecret,
      body: { filter: { open: true } },
    })

    expect(rawBalances.length).to.be.eq(BITMEX_RAW_ORDERS.length)
    expect(rawBalances).to.deep.eq(BITMEX_RAW_ORDERS)

  })



  it('should list Bitmex parsed orders just fine', async () => {

    const rawOrders = BITMEX_RAW_ORDERS

    const listRawMock = ImportMock.mockFunction(
      bitmexOrderReadModule,
      'listRaw',
      Promise.resolve(rawOrders),
    )

    const parseManyMock = ImportMock.mockFunction(
      bitmexOrderReadModule,
      'parseMany',
      BITMEX_PARSED_ORDERS,
    )

    const parsedOrders = await bitmexOrderReadModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.args[0][0]).to.deep.eq({
      rawOrders,
    })

    expect(parsedOrders.length).to.be.eq(BITMEX_PARSED_ORDERS.length)

  })

  it('should get a Bitmex raw order just fine', async () => {

    const { exchangeMock } = mockExchange()

    const rawOrder = BITMEX_RAW_ORDERS[0]

    const requestMock = ImportMock.mockFunction(
      BitmexHttp,
      'privateRequest',
      Promise.resolve(rawOrder),
    )

    const symbolPair = rawOrder.symbol
    const id = rawOrder.orderID

    const orderResponse = await bitmexOrderReadModule.getRaw({
      id,
      symbolPair,
    })

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://bitmex.com/api/v1/order',
      keySecret: exchangeMock.getValue().keySecret,
      body: { filter: { orderID: id } },
    })

    expect(rawOrder).to.deep.eq(orderResponse)

  })

  it('should get a Bitmex parsed order just fine', async () => {

    const rawOrder = BITMEX_RAW_ORDERS[0]
    const parsedOrder = BITMEX_PARSED_ORDERS[0]

    const rawOrderMock = ImportMock.mockFunction(
      bitmexOrderReadModule,
      'getRaw',
      rawOrder,
    )

    const parseMock = ImportMock.mockFunction(
      bitmexOrderReadModule,
      'parse',
      parsedOrder,
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const orderResponse = await bitmexOrderReadModule.get(params)

    expect(rawOrderMock.callCount).to.be.eq(1)
    expect(rawOrderMock.calledWith(params)).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.args[0][0]).to.deep.eq({
      rawOrder,
    })

    expect(parsedOrder).to.deep.eq(orderResponse)

  })

})
