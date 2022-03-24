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
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderEditParams,
  IAlunaOrderGetParams,
  IAlunaOrderPlaceParams,
} from '../../../lib/modules/IAlunaOrderModule'
import { GateioOrderStatusEnum } from '../enums/GateioOrderStatusEnum'
import { GateioSideEnum } from '../enums/GateioSideEnum'
import { GateioHttp } from '../GateioHttp'
import {
  GateioSpecs,
  PROD_GATEIO_URL,
} from '../GateioSpecs'
import {
  IGateioOrderRequest,
  IGateioOrderSchema,
} from '../schemas/IGateioOrderSchema'
import { GATEIO_RAW_ORDER } from '../test/fixtures/gateioOrder'
import { GateioOrderWriteModule } from './GateioOrderWriteModule'



describe('GateioOrderWriteModule', () => {

  const gateioOrderWriteModule = GateioOrderWriteModule.prototype

  const keySecret = {
    key: '',
    secret: '',
  }

  const placedOrder = 'placed-order'



  it('should place a new Gateio limit order just fine', async () => {

    ImportMock.mockOther(
      gateioOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const response = {
      data: placedOrder,
      apiRequestCount: 1,
    }

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      {
        data: placedOrder,
        apiRequestCount: 1,
      },
    )

    const parseMock = ImportMock.mockFunction(
      gateioOrderWriteModule,
      'parse',
      {
        order: placedOrder,
        apiRequestCount: 1,
      },
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 10000,
      symbolPair: 'ETHZAR',
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IGateioOrderRequest = {
      side: GateioSideEnum.BUY,
      currency_pair: placeOrderParams.symbolPair,
      amount: placeOrderParams.amount.toString(),
      price: placeOrderParams.rate!.toString(),
    }


    // place long limit order
    const {
      order: placeResponse1,
    } = await gateioOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_GATEIO_URL}/spot/orders`,
      body: requestBody,
      keySecret,
    })).to.be.ok


    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      rawOrder: placedOrder,
    })).to.be.ok

    expect(placeResponse1).to.deep.eq(placedOrder)


    // place short limit order
    const {
      order: placeResponse2,
    } = await gateioOrderWriteModule.place({
      ...placeOrderParams,
      type: AlunaOrderTypesEnum.LIMIT,
      side: AlunaOrderSideEnum.SELL,
    })

    const requestBody2: IGateioOrderRequest = {
      side: GateioSideEnum.SELL,
      currency_pair: placeOrderParams.symbolPair,
      amount: placeOrderParams.amount.toString(),
      price: placeOrderParams.rate!.toString(),
    }

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_GATEIO_URL}/spot/orders`,
      body: requestBody2,
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(2)
    expect(parseMock.calledWith({
      rawOrder: placeResponse2,
    })).to.be.ok

    expect(placeResponse2).to.deep.eq(placedOrder)

  })

  it('should throw an error if a new limit order is placed without rate',
    async () => {

      ImportMock.mockOther(
        gateioOrderWriteModule,
        'exchange',
      { keySecret } as IAlunaExchange,
      )

      const placeOrderParams: IAlunaOrderPlaceParams = {
        amount: 0.001,
        symbolPair: 'ETHZAR',
        side: AlunaOrderSideEnum.BUY,
        type: AlunaOrderTypesEnum.LIMIT,
        account: AlunaAccountEnum.EXCHANGE,
        // without rate
      }

      let result
      let error

      try {

        result = await gateioOrderWriteModule.place(placeOrderParams)

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok
      expect(error.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
      expect(error.message)
        .to.be.eq('A rate is required for limit orders')
      expect(error.httpStatusCode).to.be.eq(401)

    })

  it('should throw an request error when placing new order', async () => {

    ImportMock.mockOther(
      gateioOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const mockedError: AlunaError = new AlunaError({
      code: 'request-error',
      message: 'Something went wrong.',
      metadata: {
        code: -1000,
        msg: 'Something went wrong.',
      },
      httpStatusCode: 500,
    })

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      Promise.reject(mockedError),
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 10000,
      symbolPair: 'ETHZAR',
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IGateioOrderRequest = {
      side: GateioSideEnum.BUY,
      currency_pair: placeOrderParams.symbolPair,
      amount: placeOrderParams.amount.toString(),
      price: placeOrderParams.rate!.toString(),
    }

    let result
    let error

    try {

      result = await gateioOrderWriteModule.place(placeOrderParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_GATEIO_URL}/spot/orders`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error.message).to.be.eq('Something went wrong.')
    expect(error.httpStatusCode).to.be.eq(500)

  })

  it('should validate exchange specs when placing new orders', async () => {

    await testExchangeSpecsForOrderWriteModule({
      exchangeSpecs: GateioSpecs,
      orderWriteModule: gateioOrderWriteModule,
    })

  })

  it('should ensure an order was canceled', async () => {

    ImportMock.mockOther(
      gateioOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const mockedError: AlunaError = new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: 'Something went wrong, order not canceled',
      metadata: {},
      httpStatusCode: 500,
    })

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      Promise.reject(mockedError),
    )

    const cancelParams: IAlunaOrderGetParams = {
      id: 'order-id',
      symbolPair: 'symbol-pair',
    }

    let result
    let error

    try {

      result = await gateioOrderWriteModule.cancel(cancelParams)

    } catch (err) {

      error = err

    }

    const query = new URLSearchParams()

    query.append('currency_pair', cancelParams.symbolPair)

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.DELETE,
      url: `${PROD_GATEIO_URL}/spot/orders/${cancelParams.id}?${query.toString()}`,
      keySecret,
    })).to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq('Something went wrong, order not canceled')
    expect(error.httpStatusCode).to.be.eq(500)
    expect(error.code).to.be.eq(AlunaOrderErrorCodes.CANCEL_FAILED)

  })



  it('should cancel an open order just fine', async () => {

    ImportMock.mockOther(
      gateioOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const canceledOrderResponse = {
      status: GateioOrderStatusEnum.CLOSED,
    } as IGateioOrderSchema

    ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      {
        data: canceledOrderResponse,
        apiRequestCount: 1,
      },
    )

    const parseMock = ImportMock.mockFunction(
      gateioOrderWriteModule,
      'parse',
      {
        order: {
          status: AlunaOrderStatusEnum.CANCELED,
        },
        apiRequestCount: 1,
      },
    )

    const cancelParams: IAlunaOrderGetParams = {
      id: 'order-id',
      symbolPair: 'symbol-pair',
    }

    let canceledOrder
    let error

    try {

      const { order } = await gateioOrderWriteModule.cancel(cancelParams)

      canceledOrder = order

    } catch (err) {

      error = err

    }

    expect(error).to.be.undefined

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      rawOrder: canceledOrderResponse,
    })).to.be.ok

    expect(canceledOrder).to.be.ok
    expect(canceledOrder).to.deep.eq(parseMock.returnValues[0].order)
    expect(canceledOrder?.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

  })

  it('should edit a gateio order just fine', async () => {

    const cancelMock = ImportMock.mockFunction(
      gateioOrderWriteModule,
      'cancel',
      Promise.resolve({
        apiRequestCount: 1,
      }),
    )

    const placeMock = ImportMock.mockFunction(
      gateioOrderWriteModule,
      'place',
      Promise.resolve({
        order: GATEIO_RAW_ORDER,
        apiRequestCount: 1,
      }),
    )

    const editOrderParams: IAlunaOrderEditParams = {
      id: 'originalOrderId',
      amount: 0.001,
      rate: 0,
      symbolPair: 'LTCBTC',
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const {
      order: newOrder,
    } = await gateioOrderWriteModule.edit(editOrderParams)

    expect(newOrder).to.deep.eq(GATEIO_RAW_ORDER)

    expect(cancelMock.callCount).to.be.eq(1)
    expect(placeMock.callCount).to.be.eq(1)

  })

})
