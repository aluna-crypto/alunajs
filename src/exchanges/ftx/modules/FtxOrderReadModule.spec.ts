import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { FtxOrderStatusEnum } from '../enums/FtxOrderStatusEnum'
import { FtxOrderTypeEnum } from '../enums/FtxOrderTypeEnum'
import { FtxSideEnum } from '../enums/FtxSideEnum'
import { Ftx } from '../Ftx'
import { FtxHttp } from '../FtxHttp'
import { PROD_FTX_URL } from '../FtxSpecs'
import { IFtxOrderSchema } from '../schemas/IFtxOrderSchema'
import { FtxOrderParser } from '../schemas/parsers/FtxOrderParser'
import {
  FTX_PARSED_ORDER,
  FTX_RAW_LIMIT_ORDER,
} from '../test/fixtures/ftxOrder'
import { FtxOrderReadModule } from './FtxOrderReadModule'



describe('FtxOrderReadModule', () => {

  const ftxOrderReadModule = FtxOrderReadModule.prototype

  it('should list all Ftx raw open orders just fine', async () => {

    const ftxRawOrders = [FTX_RAW_LIMIT_ORDER]

    ImportMock.mockOther(
      ftxOrderReadModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      FtxHttp,
      'privateRequest',
      {
        data: { result: ftxRawOrders },
        requestCount: 1,
      },
    )

    const { rawOrders } = await ftxOrderReadModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawOrders.length).to.be.eq(1)

    rawOrders.forEach((order, index) => {

      const {
        avgFillPrice,
        clientId,
        createdAt,
        filledSize,
        future,
        id,
        ioc,
        market,
        postOnly,
        reduceOnly,
        remainingSize,
        size,
        price,
        side,
        status,
        type,
      } = ftxRawOrders[index]

      expect(order.avgFillPrice).to.be.eq(avgFillPrice)
      expect(order.clientId).to.be.eq(clientId)
      expect(order.createdAt).to.be.eq(createdAt)
      expect(order.filledSize).to.be.eq(filledSize)
      expect(order.future).to.be.eq(future)
      expect(order.id).to.be.eq(id)
      expect(order.ioc).to.be.eq(ioc)
      expect(order.market).to.be.eq(market)
      expect(order.postOnly).to.be.eq(postOnly)
      expect(order.reduceOnly).to.be.eq(reduceOnly)
      expect(order.remainingSize).to.be.eq(remainingSize)
      expect(order.size).to.be.eq(size)
      expect(order.side).to.be.eq(side)
      expect(order.status).to.be.eq(status)
      expect(order.type).to.be.eq(type)
      expect(order.price).to.be.eq(price)

    })

  })



  it('should list all Ftx parsed open orders just fine', async () => {

    const ftxParsedOrders = [FTX_PARSED_ORDER]

    const listRawMock = ImportMock.mockFunction(
      ftxOrderReadModule,
      'listRaw',
      {
        rawOrders: ['raw-orders'],
        requestCount: 1,
      },
    )

    const parseManyMock = ImportMock.mockFunction(
      ftxOrderReadModule,
      'parseMany',
      {
        orders: ftxParsedOrders,
        requestCount: 1,
      },
    )

    const { orders: parsedOrders } = await ftxOrderReadModule.list()

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
      } = ftxParsedOrders[index]

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



  it('should get a raw Ftx order just fine', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    ImportMock.mockOther(
      ftxOrderReadModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      FtxHttp,
      'privateRequest',
      {
        data: { result: FTX_RAW_LIMIT_ORDER },
        requestCount: 1,
      },
    )

    const symbolPair = 'symbol'
    const id = 'id'

    const { rawOrder } = await ftxOrderReadModule.getRaw({
      id,
      symbolPair,
    })


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.includes({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_FTX_URL}/orders/${id}`,
    })

    expect(rawOrder.type).to.be.eq(FtxOrderTypeEnum.LIMIT)
    expect(rawOrder.status).to.be.eq(FtxOrderStatusEnum.OPEN)
    expect(rawOrder.side).to.be.eq(FtxSideEnum.BUY)

  })



  it('should get a parsed Ftx order just fine', async () => {

    const rawOrderMock = ImportMock.mockFunction(
      ftxOrderReadModule,
      'getRaw',
      {
        rawOrder: 'rawOrder',
        requestCount: 1,
      },
    )

    const parseMock = ImportMock.mockFunction(
      ftxOrderReadModule,
      'parse',
      {
        order: FTX_PARSED_ORDER,
        requestCount: 1,
      },
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const { order: parsedOrder } = await ftxOrderReadModule.get(params)

    expect(rawOrderMock.callCount).to.be.eq(1)
    expect(rawOrderMock.calledWith(params)).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder: 'rawOrder' })).to.be.ok

    expect(parsedOrder.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder.side).to.be.eq(AlunaOrderSideEnum.BUY)

  })



  it('should parse a Ftx raw order just fine', async () => {

    const rawOrder: IFtxOrderSchema = FTX_RAW_LIMIT_ORDER

    const parseMock = ImportMock.mockFunction(
      FtxOrderParser,
      'parse',
    )

    parseMock
      .onFirstCall().returns(FTX_PARSED_ORDER)

    const {
      order: parsedOrder1,
    } = await ftxOrderReadModule.parse({ rawOrder })


    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder })).to.be.ok

    expect(parsedOrder1.symbolPair).to.be.ok
    expect(parsedOrder1.baseSymbolId).to.be.ok
    expect(parsedOrder1.quoteSymbolId).to.be.ok
    expect(parsedOrder1.total).to.be.ok
    expect(parsedOrder1.amount).to.be.ok
    expect(parsedOrder1.rate).to.be.ok
    expect(parsedOrder1.placedAt).to.be.ok


    expect(parsedOrder1.exchangeId).to.be.eq(Ftx.ID)
    expect(parsedOrder1.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedOrder1.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder1.side).to.be.eq(AlunaOrderSideEnum.BUY)

  })



  it('should parse many Ftx orders just fine', async () => {

    const rawOrders: IFtxOrderSchema[] = [FTX_RAW_LIMIT_ORDER]
    const parsedOrders: IAlunaOrderSchema[] = [FTX_PARSED_ORDER]

    const parseMock = ImportMock.mockFunction(
      FtxOrderParser,
      'parse',
    )

    parsedOrders.forEach((parsed, index) => {

      parseMock.onCall(index).returns(Promise.resolve(parsed))

    })

    const {
      orders: parsedManyResp,
    } = await ftxOrderReadModule.parseMany({ rawOrders })

    expect(parsedManyResp.length).to.be.eq(1)
    expect(parseMock.callCount).to.be.eq(1)

    parsedManyResp.forEach((parsed, index) => {

      expect(parsed).to.deep.eq(parsedOrders[index])
      expect(parseMock.calledWith({
        rawOrders: parsed,
      }))

    })

  })

})
