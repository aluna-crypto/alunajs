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
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderEditParams,
  IAlunaOrderGetParams,
  IAlunaOrderPlaceParams,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { mockValidateParams } from '../../../utils/validation/validateParams.mock'
import { BinanceHttp } from '../BinanceHttp'
import {
  BinanceSpecs,
  PROD_BINANCE_URL,
} from '../BinanceSpecs'
import { BinanceOrderStatusEnum } from '../enums/BinanceOrderStatusEnum'
import { BinanceOrderTimeInForceEnum } from '../enums/BinanceOrderTimeInForceEnum'
import { BinanceOrderTypeEnum } from '../enums/BinanceOrderTypeEnum'
import { BinanceSideEnum } from '../enums/BinanceSideEnum'
import {
  IBinanceOrderRequest,
  IBinanceOrderSchema,
} from '../schemas/IBinanceOrderSchema'
import { BINANCE_RAW_MARKETS_WITH_CURRENCY } from '../test/fixtures/binanceMarket'
import { BINANCE_RAW_ORDER } from '../test/fixtures/binanceOrder'
import { BinanceMarketModule } from './BinanceMarketModule'
import { BinanceOrderWriteModule } from './BinanceOrderWriteModule'



describe('BinanceOrderWriteModule', () => {

  const binanceOrderWriteModule = BinanceOrderWriteModule.prototype

  const keySecret = {
    key: '',
    secret: '',
  }

  const placedOrder = 'placed-order'

  it('should place a new Binance limit order just fine', async () => {

    const { validateParamsMock } = mockValidateParams()

    ImportMock.mockOther(
      binanceOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const rawMarket = BINANCE_RAW_MARKETS_WITH_CURRENCY

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      Promise.resolve({
        data: placedOrder,
        apiRequestCount: 1,
      }),
    )

    const marketListRawMock = ImportMock.mockFunction(
      BinanceMarketModule,
      'listRaw',
      {
        rawMarkets: rawMarket,
        apiRequestCount: 1,
      },
    )

    const parseMock = ImportMock.mockFunction(
      binanceOrderWriteModule,
      'parse',
      Promise.resolve({
        order: placedOrder,
        apiRequestCount: 1,
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

    const requestBody: IBinanceOrderRequest = {
      side: BinanceSideEnum.BUY,
      symbol: placeOrderParams.symbolPair,
      quantity: placeOrderParams.amount,
      price: placeOrderParams.rate,
      type: BinanceOrderTypeEnum.LIMIT,
      timeInForce: BinanceOrderTimeInForceEnum.GOOD_TIL_CANCELED,
    }


    // place long limit order
    const {
      order: placeResponse1,
      apiRequestCount,
    } = await binanceOrderWriteModule.place(placeOrderParams)


    expect(apiRequestCount).to.be.eq(7)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(marketListRawMock.callCount).to.be.eq(1)

    expect(parseMock.callCount).to.be.eq(1)

    expect(placeResponse1).to.deep.eq(placedOrder)


    // place short limit order
    const { order: placeResponse2 } = await binanceOrderWriteModule.place({
      ...placeOrderParams,
      type: AlunaOrderTypesEnum.MARKET,
      side: AlunaOrderSideEnum.SELL,
    })

    delete placeResponse2.rate

    const requestBody2: IBinanceOrderRequest = {
      side: BinanceSideEnum.SELL,
      symbol: placeOrderParams.symbolPair,
      type: BinanceOrderTypeEnum.MARKET,
      quantity: placeOrderParams.amount,
    }

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      body: requestBody2,
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(2)

    expect(placeResponse2).to.deep.eq(placedOrder)

    expect(validateParamsMock.callCount).to.be.eq(2)

  })

  it(
    'should throw an error for insufficient balance when placing new order',
    async () => {

      ImportMock.mockOther(
        binanceOrderWriteModule,
        'exchange',
      { keySecret } as IAlunaExchange,
      )

      const mockedError: AlunaError = new AlunaError({
        code: 'request-error',
        message: 'Account has insufficient balance for requested action.',
        metadata: {
          code: -2010,
          msg: 'Account has insufficient balance for requested action.',
        },
        httpStatusCode: 400,
      })

      const requestMock = ImportMock.mockFunction(
        BinanceHttp,
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

      const requestBody: IBinanceOrderRequest = {
        side: BinanceSideEnum.BUY,
        symbol: placeOrderParams.symbolPair,
        quantity: placeOrderParams.amount,
        price: placeOrderParams.rate,
        type: BinanceOrderTypeEnum.LIMIT,
        timeInForce: BinanceOrderTimeInForceEnum.GOOD_TIL_CANCELED,
      }

      let result
      let error

      try {

        result = await binanceOrderWriteModule.place(placeOrderParams)

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(requestMock.callCount).to.be.eq(1)
      expect(requestMock.calledWith({
        url: `${PROD_BINANCE_URL}/api/v3/order`,
        body: requestBody,
        keySecret,
      })).to.be.ok

      expect(error.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
      expect(error.message)
        .to.be.eq('Account has insufficient balance for requested action.')
      expect(error.httpStatusCode).to.be.eq(400)

    },
  )

  it('should throw an request error when placing new order', async () => {

    ImportMock.mockOther(
      binanceOrderWriteModule,
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
      BinanceHttp,
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

    const requestBody: IBinanceOrderRequest = {
      side: BinanceSideEnum.BUY,
      symbol: placeOrderParams.symbolPair,
      quantity: placeOrderParams.amount,
      price: placeOrderParams.rate,
      type: BinanceOrderTypeEnum.LIMIT,
      timeInForce: BinanceOrderTimeInForceEnum.GOOD_TIL_CANCELED,
    }

    let result
    let error

    try {

      result = await binanceOrderWriteModule.place(placeOrderParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error.message).to.be.eq('Something went wrong.')
    expect(error.httpStatusCode).to.be.eq(500)

  })

  it('should place a new Binance market order just fine', async () => {

    ImportMock.mockOther(
      binanceOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const rawOrder = BINANCE_RAW_ORDER
    const rawMarket = BINANCE_RAW_MARKETS_WITH_CURRENCY
    const symbolInfo = rawMarket.find((rM) => rM.symbol === rawOrder.symbol)!

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      Promise.resolve({ data: rawOrder, apiRequestCount: 1 }),
    )

    const marketListRawMock = ImportMock.mockFunction(
      BinanceMarketModule,
      'listRaw',
      {
        rawMarkets: rawMarket,
        apiRequestCount: 1,
      },
    )

    const parseMock = ImportMock.mockFunction(
      binanceOrderWriteModule,
      'parse',
      { order: rawOrder, apiRequestCount: 1 },
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 0,
      symbolPair: 'ETHZAR',
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IBinanceOrderRequest = {
      side: BinanceSideEnum.BUY,
      symbol: placeOrderParams.symbolPair,
      type: BinanceOrderTypeEnum.LIMIT,
      quantity: placeOrderParams.amount,
      price: placeOrderParams.rate,
      timeInForce: BinanceOrderTimeInForceEnum.GOOD_TIL_CANCELED,
    }


    // place long market order
    const {
      order: placeResponse1,
    } = await binanceOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(marketListRawMock.callCount).to.be.eq(1)

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      rawOrder,
      symbolInfo,
    })).to.be.ok

    expect(placeResponse1).to.deep.eq(parseMock.returnValues[0].order)


    // place short market order
    const { order: placeResponse2 } = await binanceOrderWriteModule.place({
      ...placeOrderParams,
      side: AlunaOrderSideEnum.SELL,
    })

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      body: {
        ...requestBody,
        side: BinanceSideEnum.SELL,
      },
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(2)
    expect(parseMock.calledWith({
      rawOrder,
      symbolInfo,
    })).to.be.ok

    expect(placeResponse2).to.deep.eq(rawOrder)

  })

  it('should validate exchange specs when placing new orders', async () => {

    await testExchangeSpecsForOrderWriteModule({
      exchangeSpecs: BinanceSpecs,
      orderWriteModule: binanceOrderWriteModule,
    })

  })

  it('should ensure an order was canceled', async () => {

    ImportMock.mockOther(
      binanceOrderWriteModule,
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
      BinanceHttp,
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

      result = await binanceOrderWriteModule.cancel(cancelParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.DELETE,
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      keySecret,
      body: {
        orderId: cancelParams.id,
        symbol: cancelParams.symbolPair,
      },
    })).to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq('Something went wrong, order not canceled')
    expect(error.httpStatusCode).to.be.eq(500)
    expect(error.code).to.be.eq(AlunaOrderErrorCodes.CANCEL_FAILED)

  })

  it('should cancel an open order just fine', async () => {

    ImportMock.mockOther(
      binanceOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const canceledOrderResponse = {
      status: BinanceOrderStatusEnum.CANCELED,
      orderId: 1234,
      symbol: 'ETHBUSD',
    } as IBinanceOrderSchema

    ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      { data: canceledOrderResponse, apiRequestCount: 1 },
    )

    const getMock = ImportMock.mockFunction(
      binanceOrderWriteModule,
      'get',
      {
        order: { status: AlunaOrderStatusEnum.CANCELED } as IAlunaOrderSchema,
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

      const { order } = await binanceOrderWriteModule.cancel(cancelParams)

      canceledOrder = order

    } catch (err) {

      error = err

    }

    expect(error).to.be.undefined

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.calledWith({
      id: canceledOrderResponse.orderId.toString(),
      symbolPair: canceledOrderResponse.symbol,
    })).to.be.ok

    expect(canceledOrder).to.be.ok
    expect(canceledOrder).to.deep.eq(getMock.returnValues[0].order)
    expect(canceledOrder?.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

  })

  it('should edit a binance order just fine', async () => {

    const cancelMock = ImportMock.mockFunction(
      binanceOrderWriteModule,
      'cancel',
      Promise.resolve({ apiRequestCount: 1 }),
    )

    const placeMock = ImportMock.mockFunction(
      binanceOrderWriteModule,
      'place',
      Promise.resolve({
        order: BINANCE_RAW_ORDER,
        apiRequestCount: 1,
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
    } = await binanceOrderWriteModule.edit(editOrderParams)

    expect(newOrder).to.deep.eq(BINANCE_RAW_ORDER)

    expect(cancelMock.callCount).to.be.eq(1)
    expect(placeMock.callCount).to.be.eq(1)

  })

})
