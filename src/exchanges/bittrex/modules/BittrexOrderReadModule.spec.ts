import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaOrderSchema } from '../../..'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../lib/enums/AlunaSideEnum'
import { Bittrex } from '../Bittrex'
import { BittrexHttp } from '../BittrexHttp'
import { PROD_BITTREX_URL } from '../BittrexSpecs'
import { BittrexOrderStatusEnum } from '../enums/BittrexOrderStatusEnum'
import { BittrexOrderTypeEnum } from '../enums/BittrexOrderTypeEnum'
import { BittrexSideEnum } from '../enums/BittrexSideEnum'
import { IBittrexOrderSchema } from '../schemas/IBittrexOrderSchema'
import { BittrexOrderParser } from '../schemas/parses/BittrexOrderParser'
import {
  BITTREX_PARSED_ORDER,
  BITTREX_RAW_LIMIT_ORDER,
} from '../test/fixtures/bittrexOrder'
import { BittrexOrderReadModule } from './BittrexOrderReadModule'



describe('BittrexOrderReadModule', () => {

  const bittrexOrderReadModule = BittrexOrderReadModule.prototype

  it('should list all Bittrex raw open orders just fine', async () => {

    const bittrexRawOrders = [BITTREX_RAW_LIMIT_ORDER]

    ImportMock.mockOther(
      bittrexOrderReadModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BittrexHttp,
      'privateRequest',
      bittrexRawOrders,
    )

    const rawOrders = await bittrexOrderReadModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawOrders.length).to.be.eq(1)


    rawOrders.forEach((order, index) => {

      const {
        status,
        timeInForce,
        type,
        clientOrderId,
        ceiling,
        closedAt,
        commission,
        createdAt,
        direction,
        fillQuantity,
        id,
        limit,
        marketSymbol,
        orderToCancel,
        proceeds,
        quantity,
        updatedAt,
      } = bittrexRawOrders[index]

      expect(order.clientOrderId).to.be.eq(clientOrderId)
      expect(order.status).to.be.eq(status)
      expect(order.timeInForce).to.be.eq(timeInForce)
      expect(order.type).to.be.eq(type)
      expect(order.ceiling).to.be.eq(ceiling)
      expect(order.closedAt).to.be.eq(closedAt)
      expect(order.commission).to.be.eq(commission)
      expect(order.createdAt).to.be.eq(createdAt)
      expect(order.direction).to.be.eq(direction)
      expect(order.fillQuantity).to.be.eq(fillQuantity)
      expect(order.id).to.be.eq(id)
      expect(order.limit).to.be.eq(limit)
      expect(order.marketSymbol).to.be.eq(marketSymbol)
      expect(order.orderToCancel).to.be.eq(orderToCancel)
      expect(order.proceeds).to.be.eq(proceeds)
      expect(order.quantity).to.be.eq(quantity)
      expect(order.updatedAt).to.be.eq(updatedAt)

    })

  })



  it('should list all Bittrex parsed open orders just fine', async () => {

    const bittrexParsedOrders = [BITTREX_PARSED_ORDER]

    const listRawMock = ImportMock.mockFunction(
      bittrexOrderReadModule,
      'listRaw',
      ['raw-orders'],
    )

    const parseManyMock = ImportMock.mockFunction(
      bittrexOrderReadModule,
      'parseMany',
      bittrexParsedOrders,
    )

    const parsedOrders = await bittrexOrderReadModule.list()

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
      } = bittrexParsedOrders[index]

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



  it('should get a raw Bittrex order just fine', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    ImportMock.mockOther(
      bittrexOrderReadModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BittrexHttp,
      'privateRequest',
      BITTREX_RAW_LIMIT_ORDER,
    )

    const symbolPair = 'symbol'
    const id = 'id'

    const rawOrder = await bittrexOrderReadModule.getRaw({
      id,
      symbolPair,
    })


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.includes({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITTREX_URL}/orders/${id}`,
    })

    expect(rawOrder.type).to.be.eq(BittrexOrderTypeEnum.LIMIT)
    expect(rawOrder.status).to.be.eq(BittrexOrderStatusEnum.OPEN)
    expect(rawOrder.direction).to.be.eq(BittrexSideEnum.BUY)

  })



  it('should get a parsed Bittrex order just fine', async () => {

    const rawOrderMock = ImportMock.mockFunction(
      bittrexOrderReadModule,
      'getRaw',
      'rawOrder',
    )

    const parseMock = ImportMock.mockFunction(
      bittrexOrderReadModule,
      'parse',
      BITTREX_PARSED_ORDER,
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const parsedOrder = await bittrexOrderReadModule.get(params)

    expect(rawOrderMock.callCount).to.be.eq(1)
    expect(rawOrderMock.calledWith(params)).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder: 'rawOrder' })).to.be.ok

    expect(parsedOrder.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder.side).to.be.eq(AlunaSideEnum.LONG)

  })



  it('should parse a Bittrex raw order just fine', async () => {

    const rawOrder: IBittrexOrderSchema = BITTREX_RAW_LIMIT_ORDER

    const parseMock = ImportMock.mockFunction(
      BittrexOrderParser,
      'parse',
    )


    parseMock
      .onFirstCall().returns(BITTREX_PARSED_ORDER)

    const parsedOrder1 = await bittrexOrderReadModule.parse({ rawOrder })

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder })).to.be.ok

    expect(parsedOrder1.symbolPair).to.be.ok
    expect(parsedOrder1.baseSymbolId).to.be.ok
    expect(parsedOrder1.quoteSymbolId).to.be.ok
    expect(parsedOrder1.total).to.be.ok
    expect(parsedOrder1.amount).to.be.ok
    expect(parsedOrder1.rate).to.be.ok
    expect(parsedOrder1.placedAt).to.be.ok


    expect(parsedOrder1.exchangeId).to.be.eq(Bittrex.ID)
    expect(parsedOrder1.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedOrder1.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder1.side).to.be.eq(AlunaSideEnum.LONG)

  })



  it('should parse many Bittrex orders just fine', async () => {

    const rawOrders: IBittrexOrderSchema[] = [BITTREX_RAW_LIMIT_ORDER]
    const parsedOrders: IAlunaOrderSchema[] = [BITTREX_PARSED_ORDER]

    const parseMock = ImportMock.mockFunction(
      BittrexOrderParser,
      'parse',
    )

    parsedOrders.forEach((parsed, index) => {

      parseMock.onCall(index).returns(Promise.resolve(parsed))

    })

    const parsedManyResp = await bittrexOrderReadModule.parseMany({ rawOrders })

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
