import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderEditParams,
  IAlunaOrderGetParams,
  IAlunaOrderPlaceParams,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaExchangeOrderOptionsSchema } from '../../../lib/schemas/IAlunaExchangeSchema'
import { FtxOrderTypeEnum } from '../enums/FtxOrderTypeEnum'
import { FtxSideEnum } from '../enums/FtxSideEnum'
import { FtxHttp } from '../FtxHttp'
import {
  exchangeOrderTypes as ftxExchangeOrderTypes,
  FtxSpecs,
  PROD_FTX_URL,
} from '../FtxSpecs'
import { IFtxOrderRequest } from '../schemas/IFtxOrderSchema'
import { FTX_RAW_LIMIT_ORDER } from '../test/fixtures/ftxOrder'
import { FtxOrderWriteModule } from './FtxOrderWriteModule'



describe('FtxOrderWriteModule', () => {

  const ftxOrderWriteModule = FtxOrderWriteModule.prototype

  const keySecret = {
    key: '',
    secret: '',
  }

  const placedOrder = 'placed-order'


  it('should place a new Ftx limit order just fine', async () => {

    ImportMock.mockOther(
      ftxOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      FtxHttp,
      'privateRequest',
      Promise.resolve({
        data: { result: placedOrder },
        apiRequestCount: 1,
      }),
    )

    const parseMock = ImportMock.mockFunction(
      ftxOrderWriteModule,
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

    const requestBody: IFtxOrderRequest = {
      side: FtxSideEnum.BUY,
      market: placeOrderParams.symbolPair,
      size: placeOrderParams.amount,
      price: placeOrderParams.rate || null,
      type: FtxOrderTypeEnum.LIMIT,
    }


    // place long limit order
    const {
      order: placeResponse1,
    } = await ftxOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_FTX_URL}/orders`,
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
    } = await ftxOrderWriteModule.place({
      ...placeOrderParams,
      type: AlunaOrderTypesEnum.MARKET,
      side: AlunaOrderSideEnum.SELL,
    })

    const requestBody2: IFtxOrderRequest = {
      side: FtxSideEnum.SELL,
      market: placeOrderParams.symbolPair,
      type: FtxOrderTypeEnum.MARKET,
      size: placeOrderParams.amount,
      price: null,
    }

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_FTX_URL}/orders`,
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

      let error

      ImportMock.mockOther(
        ftxOrderWriteModule,
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

      try {

        await ftxOrderWriteModule.place(placeOrderParams)

      } catch (err) {

        error = err

      }

      expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
      expect(error.message)
        .to.be.eq('A rate is required for limit orders')
      expect(error.httpStatusCode).to.be.eq(401)

    })

  it('should throw an request error when placing new order', async () => {

    ImportMock.mockOther(
      ftxOrderWriteModule,
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
      FtxHttp,
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

    const requestBody: IFtxOrderRequest = {
      side: FtxSideEnum.BUY,
      market: placeOrderParams.symbolPair,
      size: placeOrderParams.amount,
      price: placeOrderParams.rate || null,
      type: FtxOrderTypeEnum.LIMIT,
    }

    let result
    let error

    try {

      result = await ftxOrderWriteModule.place(placeOrderParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_FTX_URL}/orders`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error.message).to.be.eq('Something went wrong.')
    expect(error.httpStatusCode).to.be.eq(500)

  })



  it('should place a new Ftx market order just fine', async () => {

    ImportMock.mockOther(
      ftxOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      FtxHttp,
      'privateRequest',
      Promise.resolve({
        data: { result: placedOrder },
        apiRequestCount: 1,
      }),
    )

    const parseMock = ImportMock.mockFunction(
      ftxOrderWriteModule,
      'parse',
      {
        order: placedOrder,
        apiRequestCount: 1,
      },
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 0,
      symbolPair: 'ETHZAR',
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IFtxOrderRequest = {
      side: FtxSideEnum.BUY,
      market: placeOrderParams.symbolPair,
      type: FtxOrderTypeEnum.MARKET,
      size: placeOrderParams.amount,
      price: placeOrderParams.rate || null,
    }


    // place long market order
    const {
      order: placeResponse1,
    } = await ftxOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_FTX_URL}/orders`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      rawOrder: placedOrder,
    })).to.be.ok

    expect(placeResponse1).to.deep.eq(parseMock.returnValues[0].order)


    // place short market order
    const {
      order: placeResponse2,
    } = await ftxOrderWriteModule.place({
      ...placeOrderParams,
      side: AlunaOrderSideEnum.SELL,
    })

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_FTX_URL}/orders`,
      body: {
        ...requestBody,
        side: FtxSideEnum.SELL,
      },
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(2)
    expect(parseMock.calledWith({
      rawOrder: placedOrder,
    })).to.be.ok

    expect(placeResponse2).to.deep.eq(placedOrder)

  })



  it('should ensure given account is one of AlunaAccountEnum', async () => {

    ImportMock.mockOther(
      FtxSpecs,
      'accounts',
      [],
    )

    const account = 'nonexistent'

    let result
    let error

    try {

      result = await ftxOrderWriteModule.place({
        account,
      } as unknown as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Account type '${account}' not found`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given account is supported', async () => {

    ImportMock.mockOther(
      FtxSpecs,
      'accounts',
      [
        {
          type: AlunaAccountEnum.EXCHANGE,
          supported: false,
          implemented: true,
          orderTypes: [],
        },
      ],
    )

    const account = AlunaAccountEnum.EXCHANGE

    let result
    let error

    try {

      result = await ftxOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Account type '${account}' not supported/implemented for Ftx`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given account is implemented', async () => {

    ImportMock.mockOther(
      FtxSpecs,
      'accounts',
      [
        {
          type: AlunaAccountEnum.EXCHANGE,
          supported: true,
          implemented: false,
          orderTypes: [],
        },
      ],
    )

    const account = AlunaAccountEnum.EXCHANGE

    let result
    let error

    try {

      result = await ftxOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Account type '${account}' not supported/implemented for Ftx`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure account orderTypes has given order type', async () => {

    const accountIndex = FtxSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    const limitOrderType = ftxExchangeOrderTypes[0]

    ImportMock.mockOther(
      FtxSpecs.accounts[accountIndex],
      'orderTypes',
      [
        limitOrderType,
      ],
    )

    const type = 'unsupported-type'

    let result
    let error


    try {

      result = await ftxOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type: type as AlunaOrderTypesEnum,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Order type '${type}' not supported/implemented for Ftx`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given order type is supported', async () => {

    const accountIndex = FtxSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      FtxSpecs.accounts[accountIndex],
      'orderTypes',
      [
        {
          type: AlunaOrderTypesEnum.LIMIT,
          supported: false,
          implemented: true,
          mode: AlunaFeaturesModeEnum.WRITE,
          options: {} as IAlunaExchangeOrderOptionsSchema,
        },
      ],
    )

    const type = AlunaOrderTypesEnum.LIMIT

    let result
    let error

    try {

      result = await ftxOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Order type '${type}' not supported/implemented for Ftx`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given order type is implemented', async () => {

    const accountIndex = FtxSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      FtxSpecs.accounts[accountIndex],
      'orderTypes',
      [
        {
          type: AlunaOrderTypesEnum.LIMIT,
          supported: true,
          implemented: false,
          mode: AlunaFeaturesModeEnum.WRITE,
          options: {} as IAlunaExchangeOrderOptionsSchema,
        },
      ],
    )

    const type = AlunaOrderTypesEnum.LIMIT

    let error
    let result

    try {

      result = await ftxOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Order type '${type}' not supported/implemented for Ftx`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given order type has write mode', async () => {

    const accountIndex = FtxSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      FtxSpecs.accounts[accountIndex],
      'orderTypes',
      [
        {
          type: AlunaOrderTypesEnum.LIMIT,
          supported: true,
          implemented: true,
          mode: AlunaFeaturesModeEnum.READ,
          options: {} as IAlunaExchangeOrderOptionsSchema,
        },
      ],
    )

    const type = AlunaOrderTypesEnum.LIMIT

    let result
    let error

    try {

      result = await ftxOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Order type '${type}' is in read mode`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure an order was canceled', async () => {

    ImportMock.mockOther(
      ftxOrderWriteModule,
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
      FtxHttp,
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

      result = await ftxOrderWriteModule.cancel(cancelParams)

    } catch (err) {

      error = err


    }

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.DELETE,
      url: `${PROD_FTX_URL}/orders/${cancelParams.id}`,
      keySecret,
    })).to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq('Something went wrong, order not canceled')
    expect(error.httpStatusCode).to.be.eq(500)
    expect(error.code).to.be.eq(AlunaOrderErrorCodes.CANCEL_FAILED)

  })



  it('should cancel an open order just fine', async () => {

    ImportMock.mockOther(
      ftxOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const canceledOrderResponse = { result: 'Order cancelled' }

    ImportMock.mockFunction(
      FtxHttp,
      'privateRequest',
      {
        data: canceledOrderResponse,
        apiRequestCount: 1,
      },
    )

    const getMock = ImportMock.mockFunction(
      ftxOrderWriteModule,
      'get',
      {
        order: { status: AlunaOrderStatusEnum.CANCELED },
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

      const { order } = await ftxOrderWriteModule.cancel(cancelParams)

      canceledOrder = order

    } catch (err) {

      error = err

    }

    expect(error).to.be.undefined

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.calledWith({
      id: cancelParams.id,
      symbolPair: cancelParams.symbolPair,
    })).to.be.ok

    expect(canceledOrder).to.be.ok
    expect(canceledOrder).to.deep.eq(getMock.returnValues[0].order)
    expect(canceledOrder?.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

  })

  it('should edit a ftx order just fine', async () => {

    const cancelMock = ImportMock.mockFunction(
      ftxOrderWriteModule,
      'cancel',
      Promise.resolve({
        apiRequestCount: 1,
      }),
    )

    const placeMock = ImportMock.mockFunction(
      ftxOrderWriteModule,
      'place',
      Promise.resolve({
        order: FTX_RAW_LIMIT_ORDER,
        apiRequestCount: 1,
      }),
    )

    const editOrderParams: IAlunaOrderEditParams = {
      id: 'originalOrderId',
      amount: 0.001,
      rate: 0,
      symbolPair: 'LTCBTC',
      side: AlunaOrderSideEnum.SELL,
      type: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const {
      order: newOrder,
    } = await ftxOrderWriteModule.edit(editOrderParams)

    expect(newOrder).to.deep.eq(FTX_RAW_LIMIT_ORDER)

    expect(cancelMock.callCount).to.be.eq(1)
    expect(placeMock.callCount).to.be.eq(1)

  })

})
