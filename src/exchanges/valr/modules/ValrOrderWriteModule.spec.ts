import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { testExchangeSpecsForOrderWriteModule } from '../../../../test/helpers/orders'
import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { ValrOrderStatusEnum } from '../enums/ValrOrderStatusEnum'
import { ValrOrderTimeInForceEnum } from '../enums/ValrOrderTimeInForceEnum'
import { ValrSideEnum } from '../enums/ValrSideEnum'
import { VALR_PARSED_OPEN_ORDERS } from '../test/fixtures/valrOrder'
import { ValrHttp } from '../ValrHttp'
import { ValrSpecs } from '../ValrSpecs'
import { ValrOrderWriteModule } from './ValrOrderWriteModule'



describe('ValrOrderWriteModule', () => {

  const valrOrderWriteModule = ValrOrderWriteModule.prototype

  const keySecret = {
    key: '',
    secret: '',
  }

  const placeOrderParams: IAlunaOrderPlaceParams = {
    amount: 0.001,
    rate: 10000,
    symbolPair: 'ETHZAR',
    side: AlunaOrderSideEnum.BUY,
    type: AlunaOrderTypesEnum.LIMIT,
    account: AlunaAccountEnum.EXCHANGE,
  }

  const placedOrderId = 'placed-order-id'

  const successfulPlacedOrder: Partial<IAlunaOrderSchema> = {
    meta: {
      orderStatusType: ValrOrderStatusEnum.PLACED,
    },
  }

  const failedPlacedOrder: Partial<IAlunaOrderSchema> = {
    meta: {
      orderStatusType: ValrOrderStatusEnum.FAILED,
      failedReason: 'Order placement failed because oif this and that.',
    },
  }

  const failedPlacedOrderNoBalance: Partial<IAlunaOrderSchema> = {
    meta: {
      orderStatusType: ValrOrderStatusEnum.FAILED,
      failedReason: 'Insufficient Balance',
    },
  }

  const mockDeps = () => {

    ImportMock.mockOther(
      valrOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      {
        data: { id: placedOrderId },
        apiRequestCount: 1,
      },
    )

    return {
      requestMock,
    }

  }

  it('should place a new Valr limit order just fine', async () => {

    const { requestMock } = mockDeps()

    const getMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'get',
      Promise.resolve({
        order: successfulPlacedOrder,
        apiRequestCount: 1,
      }),
    )

    const requestBody = {
      side: ValrSideEnum.BUY,
      pair: placeOrderParams.symbolPair,
      quantity: placeOrderParams.amount,
      price: placeOrderParams.rate,
      postOnly: false,
      timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
    }

    // place long limit order
    const {
      order: placeResponse1,
    } = await valrOrderWriteModule.place(placeOrderParams)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: 'https://api.valr.com/v1/orders/limit',
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: placeOrderParams.symbolPair,
    })).to.be.ok

    expect(placeResponse1).to.deep.eq(successfulPlacedOrder)

    // place short limit order
    const { order: placeResponse2 } = await valrOrderWriteModule.place({
      ...placeOrderParams,
      type: AlunaOrderTypesEnum.MARKET,
      side: AlunaOrderSideEnum.SELL,
    })

    const requestBody2 = {
      side: ValrSideEnum.SELL,
      pair: placeOrderParams.symbolPair,
      baseAmount: placeOrderParams.amount,
    }

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: 'https://api.valr.com/v1/orders/market',
      body: requestBody2,
      keySecret,
    })).to.be.ok

    expect(getMock.callCount).to.be.eq(2)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: placeOrderParams.symbolPair,
    })).to.be.ok

    expect(placeResponse2).to.deep.eq(successfulPlacedOrder)

  })

  it('should ensure rate param is present when placing limit orders',
    async () => {

      mockDeps()

      const missingRateOrderParams = {
        ...placeOrderParams,
      }

      delete missingRateOrderParams.rate

      let result
      let error

      try {

        result = await valrOrderWriteModule.place(missingRateOrderParams)

      } catch (err) {

        error = err

      }

      expect(result).not.to.exist

      const msg = 'Rate param is required for placing new limit orders'

      expect(error).to.exist
      expect(error?.code).to.eq(AlunaGenericErrorCodes.PARAM_ERROR)
      expect(error?.message).to.eq(msg)
      expect(error?.httpStatusCode).to.eq(200)

    })

  it('should place a new Valr market order just fine', async () => {

    const { requestMock } = mockDeps()

    const getMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'get',
      {
        order: successfulPlacedOrder,
        apiRequestCount: 1,
      },
    )

    const marketOrderPlaceParams: IAlunaOrderPlaceParams = {
      ...placeOrderParams,
      type: AlunaOrderTypesEnum.MARKET,
    }

    const requestBody = {
      side: ValrSideEnum.BUY,
      pair: marketOrderPlaceParams.symbolPair,
      baseAmount: marketOrderPlaceParams.amount,
    }

    // place long market order
    const { order: placeResponse1 } = await valrOrderWriteModule.place(
      marketOrderPlaceParams,
    )

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: 'https://api.valr.com/v1/orders/market',
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: marketOrderPlaceParams.symbolPair,
    })).to.be.ok

    expect(placeResponse1).to.deep.eq(getMock.returnValues[0].order)

    // place short market order
    const { order: placeResponse2 } = await valrOrderWriteModule.place({
      ...marketOrderPlaceParams,
      side: AlunaOrderSideEnum.SELL,
    })

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: 'https://api.valr.com/v1/orders/market',
      body: {
        ...requestBody,
        side: ValrSideEnum.SELL,
      },
      keySecret,
    })).to.be.ok

    expect(getMock.callCount).to.be.eq(2)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: marketOrderPlaceParams.symbolPair,
    })).to.be.ok

    expect(placeResponse2).to.deep.eq(successfulPlacedOrder)

  })

  it('should throw if order placement fails somehow', async () => {

    mockDeps()

    ImportMock.mockFunction(
      valrOrderWriteModule,
      'get',
      {
        order: failedPlacedOrder,
        apiRequestCount: 1,
      }, // return failed response here
    )

    // try to place order
    let placeResponse: IAlunaOrderSchema | undefined
    let error: AlunaError | undefined

    try {

      const { order } = await valrOrderWriteModule.place({
        ...placeOrderParams,
        type: AlunaOrderTypesEnum.MARKET,
      })

      placeResponse = order

    } catch (err) {

      error = err

    }

    expect(placeResponse).not.to.exist

    expect(error).to.exist
    expect(error?.code).to.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error?.message).to.eq(failedPlacedOrder.meta.failedReason)
    expect(error?.httpStatusCode).to.eq(200)

  })

  it('throws if order placement fails for insufficient balance', async () => {

    mockDeps()

    ImportMock.mockFunction(
      valrOrderWriteModule,
      'get',
      {
        order: failedPlacedOrderNoBalance,
        apiRequestCount: 1,
      },
    )

    // try to place order
    let placeResponse: IAlunaOrderSchema | undefined
    let error: AlunaError | undefined

    try {

      const { order } = await valrOrderWriteModule.place({
        ...placeOrderParams,
        type: AlunaOrderTypesEnum.MARKET,
      })

      placeResponse = order

    } catch (err) {

      error = err

    }

    expect(placeResponse).not.to.exist

    expect(error).to.exist
    expect(error?.code).to.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
    expect(error?.message).to.eq(failedPlacedOrderNoBalance.meta.failedReason)
    expect(error?.httpStatusCode).to.eq(200)

  })

  it('should edit order just fine', async () => {

    mockDeps()

    const mockedOrderStatus = { orderStatusType: ValrOrderStatusEnum.ACTIVE }

    const getRawMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'getRaw',
      Promise.resolve({
        rawOrder: mockedOrderStatus,
        apiRequestCount: 1,
      }),
    )

    const cancelMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'cancel',
      Promise.resolve({
        apiRequestCount: 1,
      }),
    )

    const placeMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'place',
      Promise.resolve({
        order: VALR_PARSED_OPEN_ORDERS[0],
        apiRequestCount: 1,
      }),
    )

    const editOrderParams: IAlunaOrderEditParams = {
      id: 'originalOrderId',
      amount: 0.00,
      rate: 0,
      symbolPair: 'ETHZAR',
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const { order: newOrder } = await valrOrderWriteModule.edit(editOrderParams)

    expect(newOrder).to.deep.eq(VALR_PARSED_OPEN_ORDERS[0])

    expect(getRawMock.callCount).to.be.eq(1)
    expect(cancelMock.callCount).to.be.eq(1)
    expect(placeMock.callCount).to.be.eq(1)


    mockedOrderStatus.orderStatusType = ValrOrderStatusEnum.PARTIALLY_FILLED

    await valrOrderWriteModule.edit(editOrderParams)

    expect(getRawMock.callCount).to.be.eq(2)
    expect(cancelMock.callCount).to.be.eq(2)
    expect(placeMock.callCount).to.be.eq(2)


    mockedOrderStatus.orderStatusType = ValrOrderStatusEnum.PLACED

    await valrOrderWriteModule.edit(editOrderParams)

    expect(getRawMock.callCount).to.be.eq(3)
    expect(cancelMock.callCount).to.be.eq(3)
    expect(placeMock.callCount).to.be.eq(3)

  })

  it('should throw if its not possible to edit the order', async () => {

    mockDeps()

    const valrOrderStatusValues = Object.values(ValrOrderStatusEnum)

    const notActiveValues = valrOrderStatusValues.filter((status) => {

      return status !== ValrOrderStatusEnum.PLACED
        && status !== ValrOrderStatusEnum.ACTIVE
        && status !== ValrOrderStatusEnum.PARTIALLY_FILLED

    })

    const randomIndex = Math.floor(Math.random() * notActiveValues.length)

    const randomStatus = notActiveValues[randomIndex]

    const mockedOrderStatus = { orderStatusType: randomStatus }

    const getRawMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'getRaw',
      Promise.resolve({
        rawOrder: mockedOrderStatus,
        apiRequestCount: 1,
      }),
    )

    const cancelMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'cancel',
      Promise.resolve({
        apiRequestCount: 1,
      }),
    )

    const placeMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'place',
      Promise.resolve({
        order: VALR_PARSED_OPEN_ORDERS[0],
        apiRequestCount: 1,
      }),
    )

    const editOrderParams: IAlunaOrderEditParams = {
      id: 'originalOrderId',
      amount: 0.001,
      rate: 0,
      symbolPair: 'ETHZAR',
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    }

    let error
    let result

    try {

      result = await valrOrderWriteModule.edit(editOrderParams)

    } catch (err) {

      error = err as AlunaError

    }

    expect(result).not.to.be.ok

    const msg = 'Order is not open/active anymore'

    expect(error?.code).to.be.eq(AlunaOrderErrorCodes.IS_NOT_OPEN)
    expect(error?.message).to.be.eq(msg)

    expect(getRawMock.callCount).to.be.eq(1)
    expect(cancelMock.callCount).to.be.eq(0)
    expect(placeMock.callCount).to.be.eq(0)

  })

  it('should ensure an order was canceled', async () => {

    let error: AlunaError | undefined
    let result

    const { requestMock } = mockDeps()

    const getRawMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'getRaw',
      {
        rawOrder: {
          orderStatusType: 'any-status-but-canceled' as ValrOrderStatusEnum,
        },
        apiRequestCount: 1,
      },
    )

    const cancelParams = {
      id: 'order-id',
      symbolPair: 'symbol-pair',
    }

    try {

      result = await valrOrderWriteModule.cancel(cancelParams)

    } catch (err) {

      error = err as AlunaError

    }

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.DELETE,
      url: 'https://api.valr.com/v1/orders/order',
      keySecret,
      body: {
        orderId: cancelParams.id,
        pair: cancelParams.symbolPair,
      },
    })).to.be.ok

    expect(getRawMock.callCount).to.be.eq(1)
    expect(getRawMock.calledWith(cancelParams)).to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.eq(AlunaOrderErrorCodes.CANCEL_FAILED)
    expect(error?.message)
      .to.be.eq('Something went wrong, order not canceled')
    expect(error?.httpStatusCode).to.eq(500)

  })

  it('should cancel an open order just fine', async () => {

    mockDeps()

    const getRawMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'getRaw',
      {
        rawOrder: {
          orderStatusType: ValrOrderStatusEnum.CANCELLED,
        },
        apiRequestCount: 1,
      },
    )

    const parseMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'parse',
      {
        order: { status: AlunaOrderStatusEnum.CANCELED },
        apiRequestCount: 1,
      },
    )

    const cancelParams = {
      id: 'order-id',
      symbolPair: 'symbol-pair',
    }

    let canceledOrder
    let error

    try {

      const { order } = await valrOrderWriteModule.cancel(cancelParams)

      canceledOrder = order

    } catch (err) {

      error = err

    }

    expect(error).to.be.undefined

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      rawOrder: getRawMock.returnValues[0].rawOrder,
    })).to.be.ok

    expect(canceledOrder).to.be.ok
    expect(canceledOrder).to.deep.eq(parseMock.returnValues[0].order)
    expect(canceledOrder?.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

  })

  it('should validate exchange specs when placing new orders', async () => {

    await testExchangeSpecsForOrderWriteModule({
      exchangeSpecs: ValrSpecs,
      orderWriteModule: valrOrderWriteModule,
    })

  })

})
