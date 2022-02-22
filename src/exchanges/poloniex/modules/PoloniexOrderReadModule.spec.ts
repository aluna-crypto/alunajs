import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../lib/enums/AlunaSideEnum'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { PoloniexOrderStatusEnum } from '../enums/PoloniexOrderStatusEnum'
import { PoloniexOrderTypeEnum } from '../enums/PoloniexOrderTypeEnum'
import { Poloniex } from '../Poloniex'
import { PoloniexHttp } from '../PoloniexHttp'
import { IPoloniexOrderStatusInfo } from '../schemas/IPoloniexOrderSchema'
import { PoloniexOrderParser } from '../schemas/parsers/PoloniexOrderParser'
import {
  POLONIEX_PARSED_ORDER,
  POLONIEX_RAW_LIMIT_ORDER,
} from '../test/fixtures/poloniexOrder'
import { PoloniexOrderReadModule } from './PoloniexOrderReadModule'



describe('PoloniexOrderReadModule', () => {

  const poloniexOrderReadModule = PoloniexOrderReadModule.prototype

  it('should list all Poloniex raw open orders just fine', async () => {

    const { currencyPair, orderNumber } = POLONIEX_RAW_LIMIT_ORDER

    const poloniexRawOrder = {
      [currencyPair]: [POLONIEX_RAW_LIMIT_ORDER],
    }

    const poloniexRawOrderStatus = {
      result: {
        [orderNumber]: POLONIEX_RAW_LIMIT_ORDER,
      },
    }

    ImportMock.mockOther(
      poloniexOrderReadModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
    )

    requestMock.onFirstCall().returns(poloniexRawOrder)
    requestMock.onSecondCall().returns(poloniexRawOrderStatus)

    const rawOrders = await poloniexOrderReadModule.listRaw()

    expect(requestMock.callCount).to.be.eq(2)

    expect(rawOrders.length).to.be.eq(1)

    const indexCurrencyPair = currencyPair


    rawOrders.forEach((order) => {

      const {
        status,
        type,
        clientOrderId,
        amount,
        currencyPair,
        date,
        margin,
        orderNumber,
        rate,
        startingAmount,
        total,
      } = poloniexRawOrder[indexCurrencyPair][0]

      expect(order.clientOrderId).to.be.eq(clientOrderId)
      expect(order.status).to.be.eq(status)
      expect(order.amount).to.be.eq(amount)
      expect(order.type).to.be.eq(type)
      expect(order.currencyPair).to.be.eq(currencyPair)
      expect(order.date).to.be.eq(date)
      expect(order.margin).to.be.eq(margin)
      expect(order.orderNumber).to.be.eq(orderNumber)
      expect(order.rate).to.be.eq(rate)
      expect(order.startingAmount).to.be.eq(startingAmount)
      expect(order.total).to.be.eq(total)

    })

  })



  it('should list all Poloniex parsed open orders just fine', async () => {

    const poloniexParsedOrders = [POLONIEX_PARSED_ORDER]

    const listRawMock = ImportMock.mockFunction(
      poloniexOrderReadModule,
      'listRaw',
      ['raw-orders'],
    )

    const parseManyMock = ImportMock.mockFunction(
      poloniexOrderReadModule,
      'parseMany',
      poloniexParsedOrders,
    )

    const parsedOrders = await poloniexOrderReadModule.list()

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
      } = poloniexParsedOrders[index]

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



  it('should get a raw Poloniex order just fine', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    ImportMock.mockOther(
      poloniexOrderReadModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    const listRawMock = ImportMock.mockFunction(
      poloniexOrderReadModule,
      'listRaw',
      [POLONIEX_RAW_LIMIT_ORDER],
    )


    const { currencyPair, orderNumber } = POLONIEX_RAW_LIMIT_ORDER

    const symbolPair = currencyPair
    const id = orderNumber

    const rawOrder = await poloniexOrderReadModule.getRaw({
      id,
      symbolPair,
    })


    expect(listRawMock.callCount).to.be.eq(1)
    expect(listRawMock.calledWith()).to.be.ok

    expect(rawOrder.type).to.be.eq(PoloniexOrderTypeEnum.SELL)
    expect(rawOrder.status).to.be.eq(PoloniexOrderStatusEnum.OPEN)

  })



  it('should get a parsed Poloniex order just fine', async () => {

    const rawOrderMock = ImportMock.mockFunction(
      poloniexOrderReadModule,
      'getRaw',
      'rawOrder',
    )

    const parseMock = ImportMock.mockFunction(
      poloniexOrderReadModule,
      'parse',
      POLONIEX_PARSED_ORDER,
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const parsedOrder = await poloniexOrderReadModule.get(params)

    expect(rawOrderMock.callCount).to.be.eq(1)
    expect(rawOrderMock.calledWith(params)).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder: 'rawOrder' })).to.be.ok

    expect(parsedOrder.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder.side).to.be.eq(AlunaSideEnum.SHORT)

  })



  it('should parse a Poloniex raw order just fine', async () => {

    const rawOrder: IPoloniexOrderStatusInfo = POLONIEX_RAW_LIMIT_ORDER

    const parseMock = ImportMock.mockFunction(
      PoloniexOrderParser,
      'parse',
    )


    parseMock
      .onFirstCall().returns(POLONIEX_PARSED_ORDER)

    const parsedOrder1 = await poloniexOrderReadModule.parse({ rawOrder })

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder })).to.be.ok

    expect(parsedOrder1.symbolPair).to.be.ok
    expect(parsedOrder1.baseSymbolId).to.be.ok
    expect(parsedOrder1.quoteSymbolId).to.be.ok
    expect(parsedOrder1.total).to.be.ok
    expect(parsedOrder1.amount).to.be.ok
    expect(parsedOrder1.rate).to.be.ok
    expect(parsedOrder1.placedAt).to.be.ok


    expect(parsedOrder1.exchangeId).to.be.eq(Poloniex.ID)
    expect(parsedOrder1.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedOrder1.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder1.side).to.be.eq(AlunaSideEnum.SHORT)

  })



  it('should parse many Poloniex orders just fine', async () => {

    const rawOrders: IPoloniexOrderStatusInfo[] = [POLONIEX_RAW_LIMIT_ORDER]
    const parsedOrders: IAlunaOrderSchema[] = [POLONIEX_PARSED_ORDER]

    const parseMock = ImportMock.mockFunction(
      PoloniexOrderParser,
      'parse',
    )

    parsedOrders.forEach((parsed, index) => {

      parseMock.onCall(index).returns(Promise.resolve(parsed))

    })

    const parsedManyResp = await poloniexOrderReadModule.parseMany(
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

  it('should throw an error when an order is not found', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    ImportMock.mockOther(
      poloniexOrderReadModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    const listRawMock = ImportMock.mockFunction(
      poloniexOrderReadModule,
      'listRaw',
      [POLONIEX_RAW_LIMIT_ORDER],
    )

    const symbolPair = 'symbol-pair'
    const id = 'order-id'

    let result
    let error

    try {

      result = await poloniexOrderReadModule.getRaw({
        id,
        symbolPair,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(listRawMock.callCount).to.be.eq(1)

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error.message).to.be.eq('Order not found')
    expect(error.httpStatusCode).to.be.eq(404)

  })

})
