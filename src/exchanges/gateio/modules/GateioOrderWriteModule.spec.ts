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
import { GateioOrderStatusEnum } from '../enums/GateioOrderStatusEnum'
import { GateioSideEnum } from '../enums/GateioSideEnum'
import { GateioHttp } from '../GateioHttp'
import {
  exchangeOrderTypes as gateioExchangeOrderTypes,
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

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      Promise.resolve(placedOrder),
    )

    const parseMock = ImportMock.mockFunction(
      gateioOrderWriteModule,
      'parse',
      Promise.resolve(placedOrder),
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 10000,
      symbolPair: 'ETHZAR',
      side: AlunaSideEnum.LONG,
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
    const placeResponse1 = await gateioOrderWriteModule.place(placeOrderParams)


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
    const placeResponse2 = await gateioOrderWriteModule.place({
      ...placeOrderParams,
      type: AlunaOrderTypesEnum.LIMIT,
      side: AlunaSideEnum.SHORT,
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
        side: AlunaSideEnum.LONG,
        type: AlunaOrderTypesEnum.LIMIT,
        account: AlunaAccountEnum.EXCHANGE,
        // without rate
      }

      try {

        await gateioOrderWriteModule.place(placeOrderParams)

      } catch (err) {

        expect(err.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
        expect(err.message)
          .to.be.eq('A rate is required for limit orders')
        expect(err.httpStatusCode).to.be.eq(401)


      }

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
      side: AlunaSideEnum.LONG,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IGateioOrderRequest = {
      side: GateioSideEnum.BUY,
      currency_pair: placeOrderParams.symbolPair,
      amount: placeOrderParams.amount.toString(),
      price: placeOrderParams.rate!.toString(),
    }


    try {

      await gateioOrderWriteModule.place(placeOrderParams)

    } catch (err) {

      expect(requestMock.callCount).to.be.eq(1)
      expect(requestMock.calledWith({
        url: `${PROD_GATEIO_URL}/spot/orders`,
        body: requestBody,
        keySecret,
      })).to.be.ok

      expect(err.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
      expect(err.message).to.be.eq('Something went wrong.')
      expect(err.httpStatusCode).to.be.eq(500)


    }

  })



  it('should ensure given account is one of AlunaAccountEnum', async () => {

    ImportMock.mockOther(
      GateioSpecs,
      'accounts',
      [],
    )

    const account = 'nonexistent'

    try {

      await gateioOrderWriteModule.place({
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
      GateioSpecs,
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

      await gateioOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      const msg = `Account type '${account}' not supported/implemented for Gateio`

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(msg)

    }

  })



  it('should ensure given account is implemented', async () => {

    ImportMock.mockOther(
      GateioSpecs,
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

      await gateioOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      const msg = `Account type '${account}' not supported/implemented for Gateio`

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(msg)

    }

  })



  it('should ensure account orderTypes has given order type', async () => {

    const accountIndex = GateioSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    const limitOrderType = gateioExchangeOrderTypes[0]

    ImportMock.mockOther(
      GateioSpecs.accounts[accountIndex],
      'orderTypes',
      [
        limitOrderType,
      ],
    )

    const type = 'unsupported-type'

    try {

      await gateioOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type: type as AlunaOrderTypesEnum,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      const msg = `Order type '${type}' not supported/implemented for Gateio`

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(msg)

    }

  })



  it('should ensure given order type is supported', async () => {

    const accountIndex = GateioSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      GateioSpecs.accounts[accountIndex],
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

      await gateioOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      const msg = `Order type '${type}' not supported/implemented for Gateio`

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(msg)

    }

  })



  it('should ensure given order type is implemented', async () => {

    const accountIndex = GateioSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      GateioSpecs.accounts[accountIndex],
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

      await gateioOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      const msg = `Order type '${type}' not supported/implemented for Gateio`

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(msg)

    }

  })



  it('should ensure given order type has write mode', async () => {

    const accountIndex = GateioSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      GateioSpecs.accounts[accountIndex],
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

      await gateioOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok
      expect(err.message).to.be.eq(`Order type '${type}' is in read mode`)

    }

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

    const cancelParams: IAlunaOrderCancelParams = {
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
      canceledOrderResponse,
    )

    const parseMock = ImportMock.mockFunction(
      gateioOrderWriteModule,
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

      canceledOrder = await gateioOrderWriteModule.cancel(cancelParams)

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

  it('should edit a gateio order just fine', async () => {

    const cancelMock = ImportMock.mockFunction(
      gateioOrderWriteModule,
      'cancel',
      Promise.resolve(true),
    )

    const placeMock = ImportMock.mockFunction(
      gateioOrderWriteModule,
      'place',
      Promise.resolve(GATEIO_RAW_ORDER),
    )

    const editOrderParams: IAlunaOrderEditParams = {
      id: 'originalOrderId',
      amount: 0.001,
      rate: 0,
      symbolPair: 'LTCBTC',
      side: AlunaSideEnum.LONG,
      type: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const newOrder = await gateioOrderWriteModule.edit(editOrderParams)

    expect(newOrder).to.deep.eq(GATEIO_RAW_ORDER)

    expect(cancelMock.callCount).to.be.eq(1)
    expect(placeMock.callCount).to.be.eq(1)

  })

})
