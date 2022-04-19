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
import { HuobiOrderTypeEnum } from '../enums/HuobiOrderTypeEnum'
import * as HuobiAccuntIdMod from '../helpers/GetHuobiAccountId'
import { HuobiHttp } from '../HuobiHttp'
import {
  HuobiSpecs,
  PROD_HUOBI_URL,
} from '../HuobiSpecs'
import { IHuobiOrderRequest } from '../schemas/IHuobiOrderSchema'
import { HUOBI_RAW_ORDER } from '../test/fixtures/huobiOrder'
import { HuobiOrderWriteModule } from './HuobiOrderWriteModule'



describe('HuobiOrderWriteModule', () => {

  const huobiOrderWriteModule = HuobiOrderWriteModule.prototype

  const keySecret = {
    key: '',
    secret: '',
  }

  const placedOrder = 'placed-order'

  it('should place a new Huobi limit order just fine', async () => {

    const { validateParamsMock } = mockValidateParams()

    ImportMock.mockOther(
      huobiOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      HuobiHttp,
      'privateRequest',
      Promise.resolve({
        data: placedOrder,
        requestCount: 1,
      }),
    )

    const getHuobiAccountIdMock = ImportMock.mockFunction(
      HuobiAccuntIdMod,
      'getHuobiAccountId',
    )

    getHuobiAccountIdMock.onFirstCall().returns({
      accountId: 12345,
      requestCount: 1,
    })

    const parseMock = ImportMock.mockFunction(
      huobiOrderWriteModule,
      'get',
      Promise.resolve({
        order: placedOrder,
        requestCount: 1,
      }),
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 10000,
      symbolPair: 'btcusdt',
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IHuobiOrderRequest = {
      symbol: placeOrderParams.symbolPair,
      amount: placeOrderParams.amount.toString(),
      price: placeOrderParams.rate?.toString(),
      type: `${AlunaOrderSideEnum.BUY}-${HuobiOrderTypeEnum.LIMIT}`,
      'account-id': 12345,
      source: 'spot-api',
    }


    // place long limit order
    const {
      order: placeResponse1,
      requestCount,
    } = await huobiOrderWriteModule.place(placeOrderParams)


    expect(requestCount).to.be.eq(3)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_HUOBI_URL}/v1/order/orders/place`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)

    expect(placeResponse1).to.deep.eq(placedOrder)

    getHuobiAccountIdMock.onSecondCall().returns({
      accountId: 12345,
      requestCount: 1,
    })


    // place short limit order
    const { order: placeResponse2 } = await huobiOrderWriteModule.place({
      ...placeOrderParams,
      type: AlunaOrderTypesEnum.MARKET,
      side: AlunaOrderSideEnum.SELL,
    })

    delete placeResponse2.rate

    const requestBody2: IHuobiOrderRequest = {
      symbol: placeOrderParams.symbolPair,
      amount: placeOrderParams.amount.toString(),
      type: `${AlunaOrderSideEnum.SELL}-${HuobiOrderTypeEnum.MARKET}`,
      'account-id': 12345,
      source: 'spot-api',
    }

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_HUOBI_URL}/v1/order/orders/place`,
      body: requestBody2,
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(2)

    expect(placeResponse2).to.deep.eq(placedOrder)

    expect(validateParamsMock.callCount).to.be.eq(2)

  })

  it('should throw an request error when placing new order', async () => {

    ImportMock.mockOther(
      huobiOrderWriteModule,
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
      HuobiHttp,
      'privateRequest',
      Promise.reject(mockedError),
    )

    const getHuobiAccountIdMock = ImportMock.mockFunction(
      HuobiAccuntIdMod,
      'getHuobiAccountId',
    )

    getHuobiAccountIdMock.onFirstCall().returns({
      accountId: 12345,
      requestCount: 1,
    })

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 10000,
      symbolPair: 'btcusdt',
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IHuobiOrderRequest = {
      symbol: placeOrderParams.symbolPair,
      amount: placeOrderParams.amount.toString(),
      price: placeOrderParams.rate?.toString(),
      type: `${AlunaOrderSideEnum.BUY}-${HuobiOrderTypeEnum.LIMIT}`,
      'account-id': 12345,
      source: 'spot-api',
    }

    let result
    let error

    try {

      result = await huobiOrderWriteModule.place(placeOrderParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_HUOBI_URL}/v1/order/orders/place`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error.message).to.be.eq('Something went wrong.')
    expect(error.httpStatusCode).to.be.eq(500)

  })

  it('should place a new Huobi market order just fine', async () => {

    ImportMock.mockOther(
      huobiOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const rawOrder = HUOBI_RAW_ORDER

    const requestMock = ImportMock.mockFunction(
      HuobiHttp,
      'privateRequest',
      Promise.resolve({ data: rawOrder.id, requestCount: 1 }),
    )

    const getHuobiAccountIdMock = ImportMock.mockFunction(
      HuobiAccuntIdMod,
      'getHuobiAccountId',
    )

    getHuobiAccountIdMock.onFirstCall().returns({
      accountId: 12345,
      requestCount: 1,
    })

    const parseMock = ImportMock.mockFunction(
      huobiOrderWriteModule,
      'get',
      { order: rawOrder, requestCount: 1 },
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 1,
      symbolPair: 'btcusdt',
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IHuobiOrderRequest = {
      symbol: placeOrderParams.symbolPair,
      amount: placeOrderParams.amount.toString(),
      price: placeOrderParams.rate?.toString(),
      type: `${AlunaOrderSideEnum.BUY}-${HuobiOrderTypeEnum.LIMIT}`,
      'account-id': 12345,
      source: 'spot-api',
    }


    // place long market order
    const {
      order: placeResponse1,
    } = await huobiOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_HUOBI_URL}/v1/order/orders/place`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      id: rawOrder.id,
      symbolPair: rawOrder.symbol,
    })).to.be.ok

    expect(placeResponse1).to.deep.eq(parseMock.returnValues[0].order)

    getHuobiAccountIdMock.onSecondCall().returns({
      accountId: 12345,
      requestCount: 1,
    })


    // place short market order
    const { order: placeResponse2 } = await huobiOrderWriteModule.place({
      ...placeOrderParams,
      side: AlunaOrderSideEnum.SELL,
    })

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_HUOBI_URL}/v1/order/orders/place`,
      body: {
        ...requestBody,
        type: `${AlunaOrderSideEnum.SELL}-${HuobiOrderTypeEnum.LIMIT}`,
      },
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(2)
    expect(parseMock.calledWith({
      id: rawOrder.id,
      symbolPair: rawOrder.symbol,
    })).to.be.ok

    expect(placeResponse2).to.deep.eq(rawOrder)

  })

  it('should validate exchange specs when placing new orders', async () => {

    await testExchangeSpecsForOrderWriteModule({
      exchangeSpecs: HuobiSpecs,
      orderWriteModule: huobiOrderWriteModule,
    })

  })

  it('should ensure an order was canceled', async () => {

    ImportMock.mockOther(
      huobiOrderWriteModule,
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
      HuobiHttp,
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

      result = await huobiOrderWriteModule.cancel(cancelParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.POST,
      url: `${PROD_HUOBI_URL}/v1/order/orders/${cancelParams.id}/submitcancel`,
      keySecret,
    })).to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq('Something went wrong, order not canceled')
    expect(error.httpStatusCode).to.be.eq(500)
    expect(error.code).to.be.eq(AlunaOrderErrorCodes.CANCEL_FAILED)

  })

  it('should cancel an open order just fine', async () => {

    ImportMock.mockOther(
      huobiOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const canceledOrderResponse = '12345'

    ImportMock.mockFunction(
      HuobiHttp,
      'privateRequest',
      { data: canceledOrderResponse, requestCount: 1 },
    )

    const getMock = ImportMock.mockFunction(
      huobiOrderWriteModule,
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

      const { order } = await huobiOrderWriteModule.cancel(cancelParams)

      canceledOrder = order

    } catch (err) {

      error = err

    }

    expect(error).to.be.undefined

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.calledWith({
      id: cancelParams.id.toString(),
      symbolPair: cancelParams.symbolPair,
    })).to.be.ok

    expect(canceledOrder).to.be.ok
    expect(canceledOrder).to.deep.eq(getMock.returnValues[0].order)
    expect(canceledOrder?.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

  })

  it('should edit a huobi order just fine', async () => {

    const cancelMock = ImportMock.mockFunction(
      huobiOrderWriteModule,
      'cancel',
      Promise.resolve({ requestCount: 1 }),
    )

    const placeMock = ImportMock.mockFunction(
      huobiOrderWriteModule,
      'place',
      Promise.resolve({
        order: HUOBI_RAW_ORDER,
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
    } = await huobiOrderWriteModule.edit(editOrderParams)

    expect(newOrder).to.deep.eq(HUOBI_RAW_ORDER)

    expect(cancelMock.callCount).to.be.eq(1)
    expect(placeMock.callCount).to.be.eq(1)

  })

})

