import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaHttpErrorCodes } from '../../../index'
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
import { BinanceHttp } from '../BinanceHttp'
import {
  BinanceSpecs,
  exchangeOrderTypes as binanceExchangeOrderTypes,
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
import { BinanceOrderWriteModule } from './BinanceOrderWriteModule'



describe('BinanceOrderWriteModule', () => {

  const binanceOrderWriteModule = BinanceOrderWriteModule.prototype

  const keySecret = {
    key: '',
    secret: '',
  }

  const placedOrderId = 'placed-order-id'

  const placedOrder = 'placed-order'



  it('should place a new Binance limit order just fine', async () => {

    ImportMock.mockOther(
      binanceOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      { orderId: placedOrderId },
    )

    const getMock = ImportMock.mockFunction(
      binanceOrderWriteModule,
      'get',
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

    const requestBody: IBinanceOrderRequest = {
      side: BinanceSideEnum.BUY,
      symbol: placeOrderParams.symbolPair,
      quantity: placeOrderParams.amount,
      price: placeOrderParams.rate,
      type: BinanceOrderTypeEnum.LIMIT,
      timeInForce: BinanceOrderTimeInForceEnum.GOOD_TIL_CANCELED,
    }


    // place long limit order
    const placeResponse1 = await binanceOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      body: requestBody,
      keySecret,
    })).to.be.ok


    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: placeOrderParams.symbolPair,
    })).to.be.ok

    expect(placeResponse1).to.deep.eq(placedOrder)


    // place short limit order
    const placeResponse2 = await binanceOrderWriteModule.place({
      ...placeOrderParams,
      type: AlunaOrderTypesEnum.MARKET,
      side: AlunaSideEnum.SHORT,
    })

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

    expect(getMock.callCount).to.be.eq(2)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: placeOrderParams.symbolPair,
    })).to.be.ok

    expect(placeResponse2).to.deep.eq(placedOrder)

  })



  it('should place a new Binance market order just fine', async () => {

    ImportMock.mockOther(
      binanceOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      { orderId: placedOrderId },
    )

    const getMock = ImportMock.mockFunction(
      binanceOrderWriteModule,
      'get',
      placedOrder,
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: '0.001',
      rate: '0',
      symbolPair: 'ETHZAR',
      side: AlunaSideEnum.LONG,
      type: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IBinanceOrderRequest = {
      side: BinanceSideEnum.BUY,
      symbol: placeOrderParams.symbolPair,
      type: BinanceOrderTypeEnum.MARKET,
      quantity: placeOrderParams.amount,
    }


    // place long market order
    const placeResponse1 = await binanceOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: placeOrderParams.symbolPair,
    })).to.be.ok

    expect(placeResponse1).to.deep.eq(getMock.returnValues[0])


    // place short market order
    const placeResponse2 = await binanceOrderWriteModule.place({
      ...placeOrderParams,
      side: AlunaSideEnum.SHORT,
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

    expect(getMock.callCount).to.be.eq(2)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: placeOrderParams.symbolPair,
    })).to.be.ok

    expect(placeResponse2).to.deep.eq(placedOrder)

  })



  it('should ensure given account is one of AlunaAccountEnum', async () => {

    ImportMock.mockOther(
      BinanceSpecs,
      'accounts',
      [],
    )

    const account = 'nonexistent'

    try {

      await binanceOrderWriteModule.place({
        account,
      } as unknown as IAlunaOrderPlaceParams)

    } catch (err) {

      const msg = `Account type '${account}' not found`

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(msg)

    }

  })



  it('should ensure given account is supported', async () => {

    ImportMock.mockOther(
      BinanceSpecs,
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

    try {

      await binanceOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      const msg = `Account type '${account}' not supported/implemented for Binance`

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(msg)

    }

  })



  it('should ensure given account is implemented', async () => {

    ImportMock.mockOther(
      BinanceSpecs,
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

    try {

      await binanceOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      const msg = `Account type '${account}' not supported/implemented for Binance`

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(msg)

    }

  })



  it('should ensure account orderTypes has given order type', async () => {

    const accountIndex = BinanceSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    const limitOrderType = binanceExchangeOrderTypes[0]

    ImportMock.mockOther(
      BinanceSpecs.accounts[accountIndex],
      'orderTypes',
      [
        limitOrderType,
      ],
    )

    const type = 'unsupported-type'

    try {

      await binanceOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type: type as AlunaOrderTypesEnum,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      const msg = `Order type '${type}' not supported/implemented for Binance`

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(msg)

    }

  })



  it('should ensure given order type is supported', async () => {

    const accountIndex = BinanceSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      BinanceSpecs.accounts[accountIndex],
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

    try {

      await binanceOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      const msg = `Order type '${type}' not supported/implemented for Binance`

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(msg)

    }

  })



  it('should ensure given order type is implemented', async () => {

    const accountIndex = BinanceSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      BinanceSpecs.accounts[accountIndex],
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

    try {

      await binanceOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      const msg = `Order type '${type}' not supported/implemented for Binance`

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(msg)

    }

  })



  it('should ensure given order type has write mode', async () => {

    const accountIndex = BinanceSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      BinanceSpecs.accounts[accountIndex],
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

    try {

      await binanceOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(`Order type '${type}' is in read mode`)

    }

  })



  it('should ensure an order was canceled', async () => {

    let error
    let result

    ImportMock.mockOther(
      binanceOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      {
        status: 'any-status-but-canceled' as BinanceOrderStatusEnum,
      } as IBinanceOrderSchema,
    )

    const cancelParams: IAlunaOrderCancelParams = {
      id: 'order-id',
      symbolPair: 'symbol-pair',
    }

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
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)

  })



  it('should cancel an open order just fine', async () => {

    ImportMock.mockOther(
      binanceOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const canceledOrderResponse = {
      status: BinanceOrderStatusEnum.CANCELED,
    } as IBinanceOrderSchema

    ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      canceledOrderResponse,
    )

    const parseMock = ImportMock.mockFunction(
      binanceOrderWriteModule,
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

      canceledOrder = await binanceOrderWriteModule.cancel(cancelParams)

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

})
