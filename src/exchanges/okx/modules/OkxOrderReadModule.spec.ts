import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { OkxOrderStatusEnum } from '../enums/OkxOrderStatusEnum'
import { OkxOrderTypeEnum } from '../enums/OkxOrderTypeEnum'
import { OkxSideEnum } from '../enums/OkxSideEnum'
import { Okx } from '../Okx'
import { OkxHttp } from '../OkxHttp'
import { PROD_OKX_URL } from '../OkxSpecs'
import { IOkxOrderSchema } from '../schemas/IOkxOrderSchema'
import { OkxOrderParser } from '../schemas/parsers/OkxOrderParser'
import {
  OKX_PARSED_ORDER,
  OKX_RAW_ORDER,
} from '../test/fixtures/okxOrder'
import { OkxOrderReadModule } from './OkxOrderReadModule'



describe('OkxOrderReadModule', () => {

  const okxOrderReadModule = OkxOrderReadModule.prototype

  it('should list all Okx raw open orders just fine', async () => {

    const okxRawOrders = [OKX_RAW_ORDER]

    ImportMock.mockOther(
      okxOrderReadModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      OkxHttp,
      'privateRequest',
      { data: okxRawOrders, requestCount: 1 },
    )

    const {
      rawOrders,
      requestCount,
    } = await okxOrderReadModule.listRaw()

    expect(requestCount).to.be.eq(1)

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawOrders.length).to.be.eq(1)

    rawOrders.forEach((order, index) => {

      const {
        accFillSz,
        avgPx,
        cTime,
        ordId,
        category,
        ccy,
        clOrdId,
        fee,
        feeCcy,
        fillPx,
        fillSz,
        fillTime,
        side,
      } = okxRawOrders[index]

      expect(order.accFillSz).to.be.eq(accFillSz)
      expect(order.avgPx).to.be.eq(avgPx)
      expect(order.cTime).to.be.eq(cTime)
      expect(order.ordId).to.be.eq(ordId)
      expect(order.category).to.be.eq(category)
      expect(order.ccy).to.be.eq(ccy)
      expect(order.clOrdId).to.be.eq(clOrdId)
      expect(order.fee).to.be.eq(fee)
      expect(order.feeCcy).to.be.eq(feeCcy)
      expect(order.fillPx).to.be.eq(fillPx)
      expect(order.fillSz).to.be.eq(fillSz)
      expect(order.side).to.be.eq(side)
      expect(order.fillTime).to.be.eq(fillTime)

    })

  })

  it('should list all Okx parsed open orders just fine', async () => {

    const okxParsedOrders = [OKX_PARSED_ORDER]

    const listRawMock = ImportMock.mockFunction(
      okxOrderReadModule,
      'listRaw',
      { rawOrders: ['raw-orders'], requestCount: 1 },
    )

    const parseManyMock = ImportMock.mockFunction(
      okxOrderReadModule,
      'parseMany',
      {
        orders: okxParsedOrders,
        requestCount: 1,
      },
    )

    const { orders: parsedOrders } = await okxOrderReadModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parsedOrders.length).to.be.eq(1)

    parsedOrders.forEach((order, index) => {

      const {
        account,
        amount,
        id,
        placedAt,
        side,
        status,
        symbolPair,
        total,
        type,
        rate,
      } = okxParsedOrders[index]

      expect(order.id).to.be.eq(id)
      expect(order.account).to.be.eq(account)
      expect(order.amount).to.be.eq(amount)
      expect(order.placedAt).to.be.eq(placedAt)
      expect(order.side).to.be.eq(side)
      expect(order.status).to.be.eq(status)
      expect(order.symbolPair).to.be.eq(symbolPair)
      expect(order.total).to.be.eq(total)
      expect(order.type).to.be.eq(type)
      expect(order.rate).to.be.eq(rate)

    })

  })

  it('should get a raw Okx order just fine', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    ImportMock.mockOther(
      okxOrderReadModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      OkxHttp,
      'privateRequest',
      { data: OKX_RAW_ORDER, requestCount: 1 },
    )

    const symbolPair = 'symbol'
    const id = 'id'

    const { rawOrder } = await okxOrderReadModule.getRaw({
      id,
      symbolPair,
    })


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.includes({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_OKX_URL}/trade/order`,
    })

    expect(rawOrder.ordType).to.be.eq(OkxOrderTypeEnum.LIMIT)
    expect(rawOrder.state).to.be.eq(OkxOrderStatusEnum.LIVE)
    expect(rawOrder.side).to.be.eq(OkxSideEnum.LONG)

  })

  it('should get a parsed Okx order just fine', async () => {

    const rawOrder = OKX_RAW_ORDER

    const rawOrderMock = ImportMock.mockFunction(
      okxOrderReadModule,
      'getRaw',
      { rawOrder, requestCount: 1 },
    )

    const parseMock = ImportMock.mockFunction(
      okxOrderReadModule,
      'parse',
      { order: OKX_PARSED_ORDER, requestCount: 1 },
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const { order: parsedOrder } = await okxOrderReadModule.get(params)

    expect(rawOrderMock.callCount).to.be.eq(1)
    expect(rawOrderMock.calledWith(params)).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder })).to.be.ok

    expect(parsedOrder.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder.side).to.be.eq(AlunaOrderSideEnum.BUY)

  })

  it('should parse a Okx raw order just fine', async () => {

    const rawOrder = OKX_RAW_ORDER
    const parsedOrder = OKX_PARSED_ORDER

    const parseMock = ImportMock.mockFunction(
      OkxOrderParser,
      'parse',
      parsedOrder,
    )

    const { order: parseResponse } = await okxOrderReadModule
      .parse({ rawOrder })

    expect(parseResponse.symbolPair).to.be.ok
    expect(parseResponse.baseSymbolId).to.be.ok
    expect(parseResponse.quoteSymbolId).to.be.ok
    expect(parseResponse.total).to.be.ok
    expect(parseResponse.amount).to.be.ok
    expect(parseResponse.rate).to.be.ok
    expect(parseResponse.placedAt).to.be.ok

    expect(parseResponse.exchangeId).to.be.eq(Okx.ID)
    expect(parseResponse.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parseResponse.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parseResponse.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parseResponse.side).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.args[0][0]).to.deep.eq({
      rawOrder,
    })

  })

  it('should parse many Okx orders just fine', async () => {

    const rawOrders: IOkxOrderSchema[] = [OKX_RAW_ORDER]
    const parsedOrders: IAlunaOrderSchema[] = [OKX_PARSED_ORDER]

    const parseMock = ImportMock.mockFunction(
      OkxOrderParser,
      'parse',
    )

    parsedOrders.forEach((parsed, index) => {

      parseMock.onCall(index).returns(Promise.resolve(parsed))

    })

    const { orders: parsedManyResp } = await okxOrderReadModule.parseMany(
      { rawOrders },
    )

    expect(parsedManyResp.length).to.be.eq(1)
    expect(parseMock.callCount).to.be.eq(1)

    parsedManyResp.forEach((parsed, index) => {

      expect(parsed).to.deep.eq(parsedOrders[index])
      expect(parseMock.calledWith({
        rawOrders: parsed,
      }))

    })

  })

  it('should return early if parseMany is called without open orders',
    async () => {

      const rawOrders: IOkxOrderSchema[] = []

      const parseMock = ImportMock.mockFunction(
        OkxOrderParser,
        'parse',
      )

      const { orders: parsedManyResp } = await okxOrderReadModule.parseMany(
        { rawOrders },
      )

      expect(parsedManyResp.length).to.be.eq(0)
      expect(parseMock.callCount).to.be.eq(0)

    })

})
