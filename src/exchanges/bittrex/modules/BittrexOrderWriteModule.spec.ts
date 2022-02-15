import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import {
  AlunaHttpErrorCodes,
  AlunaOrderErrorCodes,
  IAlunaOrderEditParams,
} from '../../../index'
import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../lib/enums/AlunaSideEnum'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderPlaceParams,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaExchangeOrderOptionsSchema } from '../../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { BittrexHttp } from '../BittrexHttp'
import {
  BittrexSpecs,
  exchangeOrderTypes as bittrexExchangeOrderTypes,
  PROD_BITTREX_URL,
} from '../BittrexSpecs'
import { BittrexOrderStatusEnum } from '../enums/BittrexOrderStatusEnum'
import { BittrexOrderTimeInForceEnum } from '../enums/BittrexOrderTimeInForceEnum'
import { BittrexOrderTypeEnum } from '../enums/BittrexOrderTypeEnum'
import { BittrexSideEnum } from '../enums/BittrexSideEnum'
import {
  IBittrexOrderRequest,
  IBittrexOrderSchema,
} from '../schemas/IBittrexOrderSchema'
import { BITTREX_RAW_LIMIT_ORDER } from '../test/fixtures/bittrexOrder'
import { BittrexOrderWriteModule } from './BittrexOrderWriteModule'



describe('BittrexOrderWriteModule', () => {

  const bittrexOrderWriteModule = BittrexOrderWriteModule.prototype

  const keySecret = {
    key: '',
    secret: '',
  }

  const placedOrder = 'placed-order'



  it('should place a new Bittrex limit order just fine', async () => {

    ImportMock.mockOther(
      bittrexOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BittrexHttp,
      'privateRequest',
      Promise.resolve(placedOrder),
    )

    const parseMock = ImportMock.mockFunction(
      bittrexOrderWriteModule,
      'parse',
      Promise.resolve(placedOrder),
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: '0.001',
      rate: '10000',
      symbolPair: 'ETHZAR',
      side: AlunaSideEnum.LONG,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IBittrexOrderRequest = {
      direction: BittrexSideEnum.BUY,
      marketSymbol: placeOrderParams.symbolPair,
      quantity: Number(placeOrderParams.amount),
      limit: Number(placeOrderParams.rate),
      type: BittrexOrderTypeEnum.LIMIT,
      timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
    }


    // place long limit order
    const placeResponse1 = await bittrexOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_BITTREX_URL}/orders`,
      body: requestBody,
      keySecret,
    })).to.be.ok


    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      rawOrder: placedOrder,
    })).to.be.ok

    expect(placeResponse1).to.deep.eq(placedOrder)


    // place short limit order
    const placeResponse2 = await bittrexOrderWriteModule.place({
      ...placeOrderParams,
      type: AlunaOrderTypesEnum.MARKET,
      side: AlunaSideEnum.SHORT,
    })

    const requestBody2: IBittrexOrderRequest = {
      direction: BittrexSideEnum.SELL,
      marketSymbol: placeOrderParams.symbolPair,
      type: BittrexOrderTypeEnum.MARKET,
      quantity: Number(placeOrderParams.amount),
      timeInForce: BittrexOrderTimeInForceEnum.FILL_OR_KILL,
    }

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_BITTREX_URL}/orders`,
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
        bittrexOrderWriteModule,
        'exchange',
      { keySecret } as IAlunaExchange,
      )

      const placeOrderParams: IAlunaOrderPlaceParams = {
        amount: '0.001',
        symbolPair: 'ETHZAR',
        side: AlunaSideEnum.LONG,
        type: AlunaOrderTypesEnum.LIMIT,
        account: AlunaAccountEnum.EXCHANGE,
        // without rate
      }

      let result
      let error

      try {

        result = await bittrexOrderWriteModule.place(placeOrderParams)

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok
      expect(error.code).to.be.eq(AlunaOrderErrorCodes.MISSING_PARAMS)
      expect(error.message)
        .to.be.eq('A rate is required for limit orders')
      expect(error.httpStatusCode).to.be.eq(401)

    })

  it('should throw an request error when placing new order', async () => {

    ImportMock.mockOther(
      bittrexOrderWriteModule,
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
      BittrexHttp,
      'privateRequest',
      Promise.reject(mockedError),
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: '0.001',
      rate: '10000',
      symbolPair: 'ETHZAR',
      side: AlunaSideEnum.LONG,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IBittrexOrderRequest = {
      direction: BittrexSideEnum.BUY,
      marketSymbol: placeOrderParams.symbolPair,
      quantity: Number(placeOrderParams.amount),
      limit: Number(placeOrderParams.rate),
      type: BittrexOrderTypeEnum.LIMIT,
      timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
    }

    let result
    let error

    try {

      result = await bittrexOrderWriteModule.place(placeOrderParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_BITTREX_URL}/orders`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error.message).to.be.eq('Something went wrong.')
    expect(error.httpStatusCode).to.be.eq(500)

  })



  it('should place a new Bittrex market order just fine', async () => {

    ImportMock.mockOther(
      bittrexOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BittrexHttp,
      'privateRequest',
      Promise.resolve(placedOrder),
    )

    const parseMock = ImportMock.mockFunction(
      bittrexOrderWriteModule,
      'parse',
      placedOrder,
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: '0.001',
      rate: '0',
      symbolPair: 'ETHZAR',
      side: AlunaSideEnum.SHORT,
      type: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IBittrexOrderRequest = {
      direction: BittrexSideEnum.SELL,
      marketSymbol: placeOrderParams.symbolPair,
      type: BittrexOrderTypeEnum.MARKET,
      timeInForce: BittrexOrderTimeInForceEnum.FILL_OR_KILL,
      quantity: Number(placeOrderParams.amount),
    }


    // place long market order
    const placeResponse1 = await bittrexOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_BITTREX_URL}/orders`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      rawOrder: placedOrder,
    })).to.be.ok

    expect(placeResponse1).to.deep.eq(parseMock.returnValues[0])


    // place short market order
    const placeResponse2 = await bittrexOrderWriteModule.place({
      ...placeOrderParams,
    })

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_BITTREX_URL}/orders`,
      body: requestBody,
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
      BittrexSpecs,
      'accounts',
      [],
    )

    const account = 'nonexistent'
    let result
    let error

    try {

      result = await bittrexOrderWriteModule.place({
        account,
      } as unknown as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    const msg = `Account type '${account}' not found`

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given account is supported', async () => {

    ImportMock.mockOther(
      BittrexSpecs,
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

      result = await bittrexOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    const msg = `Account type '${account}' not supported/implemented for Bittrex`

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given account is implemented', async () => {

    ImportMock.mockOther(
      BittrexSpecs,
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

      result = await bittrexOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    const msg = `Account type '${account}' not supported/implemented for Bittrex`

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure account orderTypes has given order type', async () => {

    const accountIndex = BittrexSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    const limitOrderType = bittrexExchangeOrderTypes[0]

    ImportMock.mockOther(
      BittrexSpecs.accounts[accountIndex],
      'orderTypes',
      [
        limitOrderType,
      ],
    )

    const type = 'unsupported-type'
    let result
    let error

    try {

      result = await bittrexOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type: type as AlunaOrderTypesEnum,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    const msg = `Order type '${type}' not supported/implemented for Bittrex`

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given order type is supported', async () => {

    const accountIndex = BittrexSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      BittrexSpecs.accounts[accountIndex],
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

      result = await bittrexOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    const msg = `Order type '${type}' not supported/implemented for Bittrex`

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given order type is implemented', async () => {

    const accountIndex = BittrexSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      BittrexSpecs.accounts[accountIndex],
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
    let result
    let error

    try {

      result = await bittrexOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    const msg = `Order type '${type}' not supported/implemented for Bittrex`

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given order type has write mode', async () => {

    const accountIndex = BittrexSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      BittrexSpecs.accounts[accountIndex],
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

      result = await bittrexOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(`Order type '${type}' is in read mode`)

  })



  it('should ensure an order was canceled', async () => {

    ImportMock.mockOther(
      bittrexOrderWriteModule,
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
      BittrexHttp,
      'privateRequest',
      Promise.reject(mockedError),
    )

    const cancelParams: IAlunaOrderCancelParams = {
      id: 'order-id',
      symbolPair: 'symbol-pair',
    }

    let result
    let error

    try {

      result = await bittrexOrderWriteModule.cancel(cancelParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.DELETE,
      url: `${PROD_BITTREX_URL}/orders/${cancelParams.id}`,
      keySecret,
    })).to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq('Something went wrong, order not canceled')
    expect(error.httpStatusCode).to.be.eq(500)
    expect(error.code).to.be.eq(AlunaOrderErrorCodes.CANCEL_FAILED)

  })



  it('should cancel an open order just fine', async () => {

    ImportMock.mockOther(
      bittrexOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const canceledOrderResponse = {
      status: BittrexOrderStatusEnum.CLOSED,
    } as IBittrexOrderSchema

    ImportMock.mockFunction(
      BittrexHttp,
      'privateRequest',
      canceledOrderResponse,
    )

    const parseMock = ImportMock.mockFunction(
      bittrexOrderWriteModule,
      'parse',
      { status: AlunaOrderStatusEnum.CANCELED } as IAlunaOrderSchema,
    )

    const cancelParams: IAlunaOrderCancelParams = {
      id: 'order-id',
      symbolPair: 'symbol-pair',
    }

    let canceledOrder
    let error

    try {

      canceledOrder = await bittrexOrderWriteModule.cancel(cancelParams)

    } catch (err) {

      error = err

    }

    expect(error).to.be.undefined

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      rawOrder: canceledOrderResponse,
    })).to.be.ok

    expect(canceledOrder).to.be.ok
    expect(canceledOrder).to.deep.eq(parseMock.returnValues[0])
    expect(canceledOrder?.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

  })

  it('should edit a bittrex order just fine', async () => {

    const cancelMock = ImportMock.mockFunction(
      bittrexOrderWriteModule,
      'cancel',
      Promise.resolve(true),
    )

    const placeMock = ImportMock.mockFunction(
      bittrexOrderWriteModule,
      'place',
      Promise.resolve(BITTREX_RAW_LIMIT_ORDER),
    )

    const editOrderParams: IAlunaOrderEditParams = {
      id: 'originalOrderId',
      amount: '0.001',
      rate: '0',
      symbolPair: 'LTCBTC',
      side: AlunaSideEnum.LONG,
      type: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const newOrder = await bittrexOrderWriteModule.edit(editOrderParams)

    expect(newOrder).to.deep.eq(BITTREX_RAW_LIMIT_ORDER)

    expect(cancelMock.callCount).to.be.eq(1)
    expect(placeMock.callCount).to.be.eq(1)

  })

})
