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
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { mockValidateParams } from '../../../utils/validation/validateParams.mock'
import { OkxOrderTypeEnum } from '../enums/OkxOrderTypeEnum'
import { OkxSideEnum } from '../enums/OkxSideEnum'
import { OkxHttp } from '../OkxHttp'
import {
  OkxSpecs,
  PROD_OKX_URL,
} from '../OkxSpecs'
import {
  IOkxOrderRequest,
} from '../schemas/IOkxOrderSchema'
import { OKX_RAW_ORDER } from '../test/fixtures/okxOrder'
import { OkxOrderWriteModule } from './OkxOrderWriteModule'



describe('OkxOrderWriteModule', () => {

  const okxOrderWriteModule = OkxOrderWriteModule.prototype

  const keySecret = {
    key: '',
    secret: '',
  }

  const placedOrder = 'placed-order'

  it('should place a new Okx limit order just fine', async () => {

    const { validateParamsMock } = mockValidateParams()

    ImportMock.mockOther(
      okxOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      OkxHttp,
      'privateRequest',
      Promise.resolve({
        data: placedOrder,
        requestCount: 1,
      }),
    )

    const parseMock = ImportMock.mockFunction(
      okxOrderWriteModule,
      'parse',
      Promise.resolve({
        order: placedOrder,
        requestCount: 1,
      }),
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 10000,
      symbolPair: 'ETHZAR',
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IOkxOrderRequest = {
      side: OkxSideEnum.LONG,
      instId: placeOrderParams.symbolPair,
      sz: placeOrderParams.amount.toString(),
      px: placeOrderParams.rate!.toString(),
      ordType: OkxOrderTypeEnum.LIMIT,
      tdMode: 'cash',
    }


    // place long limit order
    const {
      order: placeResponse1,
      requestCount,
    } = await okxOrderWriteModule.place(placeOrderParams)


    expect(requestCount).to.be.eq(2)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_OKX_URL}/trade/order`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)

    expect(placeResponse1).to.deep.eq(placedOrder)


    // place short limit order
    const { order: placeResponse2 } = await okxOrderWriteModule.place({
      ...placeOrderParams,
      type: AlunaOrderTypesEnum.MARKET,
      side: AlunaOrderSideEnum.SELL,
      account: AlunaAccountEnum.MARGIN,
    })

    delete placeResponse2.rate

    const requestBody2: IOkxOrderRequest = {
      side: OkxSideEnum.SHORT,
      instId: placeOrderParams.symbolPair,
      ordType: OkxOrderTypeEnum.MARKET,
      sz: placeOrderParams.amount.toString(),
      tdMode: 'cross',
    }

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_OKX_URL}/trade/order`,
      body: requestBody2,
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(2)

    expect(placeResponse2).to.deep.eq(placedOrder)

    expect(validateParamsMock.callCount).to.be.eq(2)

  })

  it('should throw an request error when placing new order', async () => {

    ImportMock.mockOther(
      okxOrderWriteModule,
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
      OkxHttp,
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

    const requestBody: IOkxOrderRequest = {
      side: OkxSideEnum.LONG,
      instId: placeOrderParams.symbolPair,
      sz: placeOrderParams.amount.toString(),
      px: placeOrderParams.rate!.toString(),
      ordType: OkxOrderTypeEnum.LIMIT,
      tdMode: 'cash',
    }

    let result
    let error

    try {

      result = await okxOrderWriteModule.place(placeOrderParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_OKX_URL}/trade/order`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error.message).to.be.eq('Something went wrong.')
    expect(error.httpStatusCode).to.be.eq(500)

  })

  it('should place a new Okx market order just fine', async () => {

    ImportMock.mockOther(
      okxOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const rawOrder = OKX_RAW_ORDER

    const requestMock = ImportMock.mockFunction(
      OkxHttp,
      'privateRequest',
      Promise.resolve({ data: rawOrder, requestCount: 1 }),
    )

    const parseMock = ImportMock.mockFunction(
      okxOrderWriteModule,
      'parse',
      { order: rawOrder, requestCount: 1 },
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 0,
      symbolPair: 'ETHZAR',
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IOkxOrderRequest = {
      side: OkxSideEnum.LONG,
      instId: placeOrderParams.symbolPair,
      ordType: OkxOrderTypeEnum.LIMIT,
      sz: placeOrderParams.amount.toString(),
      px: placeOrderParams.rate!.toString(),
      tdMode: 'cash',
    }


    // place long market order
    const {
      order: placeResponse1,
    } = await okxOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_OKX_URL}/trade/order`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      rawOrder,
    })).to.be.ok

    expect(placeResponse1).to.deep.eq(parseMock.returnValues[0].order)

    // place short market order
    const { order: placeResponse2 } = await okxOrderWriteModule.place({
      ...placeOrderParams,
      side: AlunaOrderSideEnum.SELL,
    })

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_OKX_URL}/trade/order`,
      body: {
        ...requestBody,
        side: OkxSideEnum.SHORT,
      },
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(2)
    expect(parseMock.calledWith({
      rawOrder,
    })).to.be.ok

    expect(placeResponse2).to.deep.eq(rawOrder)

  })

  it('should validate exchange specs when placing new orders', async () => {

    await testExchangeSpecsForOrderWriteModule({
      exchangeSpecs: OkxSpecs,
      orderWriteModule: okxOrderWriteModule,
    })

  })

  it('should ensure an order was canceled', async () => {

    ImportMock.mockOther(
      okxOrderWriteModule,
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
      OkxHttp,
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

      result = await okxOrderWriteModule.cancel(cancelParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.POST,
      url: `${PROD_OKX_URL}/trade/cancel-order`,
      keySecret,
      body: {
        ordId: cancelParams.id,
        instId: cancelParams.symbolPair,
      },
    })).to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq('Something went wrong, order not canceled')
    expect(error.httpStatusCode).to.be.eq(500)
    expect(error.code).to.be.eq(AlunaOrderErrorCodes.CANCEL_FAILED)

  })

  it('should cancel an open order just fine', async () => {

    ImportMock.mockOther(
      okxOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const canceledOrderResponse = {
      ordId: 1234,
    }

    ImportMock.mockFunction(
      OkxHttp,
      'privateRequest',
      { data: [canceledOrderResponse], requestCount: 1 },
    )

    const getMock = ImportMock.mockFunction(
      okxOrderWriteModule,
      'get',
      {
        order: { status: AlunaOrderStatusEnum.CANCELED } as IAlunaOrderSchema,
        requestCount: 1,
      },
    )

    const cancelParams: IAlunaOrderGetParams = {
      id: 'order-id',
      symbolPair: 'symbol-pair',
    }

    let canceledOrder
    let error

    try {

      const { order } = await okxOrderWriteModule.cancel(cancelParams)

      canceledOrder = order

    } catch (err) {

      error = err

    }

    expect(error).to.be.undefined

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.calledWith({
      id: canceledOrderResponse.ordId.toString(),
      symbolPair: cancelParams.symbolPair,
    })).to.be.ok

    expect(canceledOrder).to.be.ok
    expect(canceledOrder).to.deep.eq(getMock.returnValues[0].order)
    expect(canceledOrder?.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

  })

  it('should edit a okx order just fine', async () => {

    const cancelMock = ImportMock.mockFunction(
      okxOrderWriteModule,
      'cancel',
      Promise.resolve({ requestCount: 1 }),
    )

    const placeMock = ImportMock.mockFunction(
      okxOrderWriteModule,
      'place',
      Promise.resolve({
        order: OKX_RAW_ORDER,
        requestCount: 1,
      }),
    )

    const editOrderParams: IAlunaOrderEditParams = {
      id: 'originalOrderId',
      amount: 0.001,
      rate: 0,
      symbolPair: 'LTCBTC',
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const {
      order: newOrder,
    } = await okxOrderWriteModule.edit(editOrderParams)

    expect(newOrder).to.deep.eq(OKX_RAW_ORDER)

    expect(cancelMock.callCount).to.be.eq(1)
    expect(placeMock.callCount).to.be.eq(1)

  })

})
