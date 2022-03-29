import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { PoloniexOrderTypeEnum } from '../enums/PoloniexOrderTypeEnum'
import { Poloniex } from '../Poloniex'
import { PoloniexHttp } from '../PoloniexHttp'
import { IPoloniexOrderWithCurrency } from '../schemas/IPoloniexOrderSchema'
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

    requestMock.onFirstCall().returns({
      data: poloniexRawOrder,
      apiRequestCount: 1,
    })
    requestMock.onSecondCall().returns({
      data: poloniexRawOrderStatus,
      apiRequestCount: 1,
    })

    const { rawOrders } = await poloniexOrderReadModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawOrders.length).to.be.eq(1)

    const indexCurrencyPair = currencyPair


    rawOrders.forEach((order) => {

      const {
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
      { rawOrders: ['raw-orders'], apiRequestCount: 1 },
    )

    const parseManyMock = ImportMock.mockFunction(
      poloniexOrderReadModule,
      'parseMany',
      { orders: poloniexParsedOrders, apiRequestCount: 1 },
    )

    const { orders: parsedOrders } = await poloniexOrderReadModule.list()

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



  it('should get a raw Poloniex order status just fine', async () => {

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

    const { currencyPair, orderNumber } = POLONIEX_RAW_LIMIT_ORDER

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      {
        data: {
          result: {
            [orderNumber]: POLONIEX_RAW_LIMIT_ORDER,
          },
        },
        apiRequestCount: 1,
      },
    )


    const symbolPair = currencyPair
    const id = orderNumber

    const { rawOrder } = await poloniexOrderReadModule.getRaw({
      id,
      symbolPair,
    })

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawOrder.type).to.be.eq(PoloniexOrderTypeEnum.SELL)

  })

  it('should get a raw Poloniex order trades just fine', async () => {

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

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      {
        data: [POLONIEX_RAW_LIMIT_ORDER],
        apiRequestCount: 1,
      },
    )

    requestMock.onFirstCall().returns(Promise.reject(new Error('')))

    const { currencyPair, orderNumber } = POLONIEX_RAW_LIMIT_ORDER

    const symbolPair = currencyPair
    const id = orderNumber

    const { rawOrder } = await poloniexOrderReadModule.getRaw({
      id,
      symbolPair,
    })

    expect(requestMock.callCount).to.be.eq(2)

    expect(rawOrder.type).to.be.eq(PoloniexOrderTypeEnum.SELL)

  })

  it('should get a raw Poloniex order status just fine', async () => {

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

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
    )

    const { orderNumber, currencyPair } = POLONIEX_RAW_LIMIT_ORDER

    requestMock.onFirstCall().returns({
      data: {
        result:
          { [orderNumber]: POLONIEX_RAW_LIMIT_ORDER },
      },
      apiRequestCount: 1,
    })


    const id = orderNumber
    const symbolPair = currencyPair

    const { rawOrder } = await poloniexOrderReadModule.getRaw({
      id,
      symbolPair,
    })

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawOrder.type).to.be.eq(PoloniexOrderTypeEnum.SELL)

  })

  // it('should get a raw Poloniex order trades just fine', async () => {

  //   const keySecret = {
  //     key: '',
  //     secret: '',
  //   }

  //   ImportMock.mockOther(
  //     poloniexOrderReadModule,
  //     'exchange',
  //     {
  //       keySecret,
  //     } as IAlunaExchange,
  //   )

  //   const requestMock = ImportMock.mockFunction(
  //     PoloniexHttp,
  //     'privateRequest',
  //   )

  //   requestMock.onFirstCall().returns(Promise.reject())
  //   requestMock.onSecondCall().returns([POLONIEX_RAW_LIMIT_ORDER])

  //   const { orderNumber } = POLONIEX_RAW_LIMIT_ORDER

  //   const id = orderNumber

  //   const rawOrder = await poloniexOrderReadModule.getOrderTrades(id)

  //   expect(requestMock.callCount).to.be.eq(1)

  //   expect(rawOrder[0].type).to.be.eq(PoloniexOrderTypeEnum.SELL)

  // })



  it('should get a parsed Poloniex order just fine', async () => {

    const rawOrderMock = ImportMock.mockFunction(
      poloniexOrderReadModule,
      'getRaw',
      { rawOrder: 'rawOrder', apiRequestCount: 1 },
    )

    const parseMock = ImportMock.mockFunction(
      poloniexOrderReadModule,
      'parse',
      { order: POLONIEX_PARSED_ORDER, apiRequestCount: 1 },
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const { order: parsedOrder } = await poloniexOrderReadModule.get(params)

    expect(rawOrderMock.callCount).to.be.eq(1)
    expect(rawOrderMock.calledWith(params)).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder: 'rawOrder' })).to.be.ok

    expect(parsedOrder.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder.side).to.be.eq(AlunaOrderSideEnum.SELL)

  })



  it('should parse a Poloniex raw order just fine', async () => {

    const rawOrder: IPoloniexOrderWithCurrency = POLONIEX_RAW_LIMIT_ORDER

    const parseMock = ImportMock.mockFunction(
      PoloniexOrderParser,
      'parse',
    )


    parseMock
      .onFirstCall().returns(POLONIEX_PARSED_ORDER)

    const {
      order: parsedOrder1,
    } = await poloniexOrderReadModule.parse({ rawOrder })

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
    expect(parsedOrder1.side).to.be.eq(AlunaOrderSideEnum.SELL)

  })



  it('should parse many Poloniex orders just fine', async () => {

    const rawOrders: IPoloniexOrderWithCurrency[] = [POLONIEX_RAW_LIMIT_ORDER]
    const parsedOrders: IAlunaOrderSchema[] = [POLONIEX_PARSED_ORDER]

    const parseMock = ImportMock.mockFunction(
      PoloniexOrderParser,
      'parse',
    )

    parsedOrders.forEach((parsed, index) => {

      parseMock.onCall(index).returns(Promise.resolve(parsed))

    })

    const { orders: parsedManyResp } = await poloniexOrderReadModule.parseMany(
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

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      { data: { result: {} } },
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

    expect(requestMock.callCount).to.be.eq(1)

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error.message).to.be.eq('Order not found')
    expect(error.httpStatusCode).to.be.eq(404)

  })

  it('should throw an error when an order status is canceled', async () => {

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

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      Promise.reject({}),
    )

    const id = 'order-id'
    const symbolPair = 'symbol-pair'

    let result
    let error

    try {

      result = await poloniexOrderReadModule.getRaw({
        id,
        symbolPair,
      })

    } catch (err) {

      console.log('🚀 ~ file: PoloniexOrderReadModule.spec.ts ~ line 526 ~ it ~ err', err)

      error = err

    }
    console.log('🚀 ~ file: PoloniexOrderReadModule.spec.ts ~ line 529 ~ it ~ error', error)

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(2)

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.ORDER_CANCELLED)
    expect(error.message).to.be.eq('This order is already cancelled')
    expect(error.httpStatusCode).to.be.eq(422)

  })

  it('should throw an error when an order status is not found', async () => {

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

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
    )

    requestMock.onFirstCall().returns({
      data: {
        result: {
          error: 'Order status not found',
        },
      },
      apiRequestCount: 1,
    })
    requestMock.onSecondCall().returns({
      data: {},
      apiRequestCount: 1,
    })

    const id = 'order-id'
    const symbolPair = 'symbol-pair'

    let error

    try {

      await poloniexOrderReadModule.getRaw({
        id,
        symbolPair,
      })

    } catch (err) {

      error = err

    }

    expect(requestMock.callCount).to.be.eq(2)

    expect(error).to.be.ok

  })

  it('should throw an error when an order trade is not found', async () => {

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

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
    )

    requestMock.onFirstCall().returns(Promise.reject({}))
    requestMock.onSecondCall().returns({
      data: { error: 'Order trade not found' },
      apiRequestCount: 1,
    })

    const id = 'order-id'
    const symbolPair = 'symbolPair'

    let error

    try {

      await poloniexOrderReadModule.getRaw({
        id,
        symbolPair,
      })

    } catch (err) {

      error = err

    }

    expect(requestMock.callCount).to.be.eq(2)

    expect(error).to.be.ok

  })

})
