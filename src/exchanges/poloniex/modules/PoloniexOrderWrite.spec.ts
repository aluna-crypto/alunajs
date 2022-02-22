import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../lib/enums/AlunaSideEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaExchangeOrderOptionsSchema } from '../../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { PoloniexHttp } from '../PoloniexHttp'
import {
  exchangeOrderTypes as poloniexExchangeOrderTypes,
  PoloniexSpecs,
} from '../PoloniexSpecs'
import { POLONIEX_RAW_LIMIT_ORDER } from '../test/fixtures/poloniexOrder'
import { PoloniexOrderWriteModule } from './PoloniexOrderWriteModule'



describe('PoloniexOrderWriteModule', () => {

  const poloniexOrderWriteModule = PoloniexOrderWriteModule.prototype

  const keySecret = {
    key: '',
    secret: '',
  }

  const placedOrder = 'placed-order'


  it('should place a new Poloniex limit order just fine', async () => {

    ImportMock.mockOther(
      poloniexOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      Promise.resolve(placedOrder),
    )

    const getMock = ImportMock.mockFunction(
      poloniexOrderWriteModule,
      'get',
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

    // place long limit order
    const placeResponse1 = await poloniexOrderWriteModule
      .place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)


    expect(getMock.callCount).to.be.eq(1)

    expect(placeResponse1).to.deep.eq(placedOrder)

  })

  it('should throw an error if a new limit order is placed without rate',
    async () => {

      let error

      ImportMock.mockOther(
        poloniexOrderWriteModule,
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

        await poloniexOrderWriteModule.place(placeOrderParams)

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
      poloniexOrderWriteModule,
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
      PoloniexHttp,
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

    let result
    let error

    try {

      result = await poloniexOrderWriteModule.place(placeOrderParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error.message).to.be.eq('Something went wrong.')
    expect(error.httpStatusCode).to.be.eq(500)

  })



  it('should ensure given account is one of AlunaAccountEnum', async () => {

    ImportMock.mockOther(
      PoloniexSpecs,
      'accounts',
      [],
    )

    const account = 'nonexistent'

    let result
    let error

    try {

      result = await poloniexOrderWriteModule.place({
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
      PoloniexSpecs,
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

      result = await poloniexOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Account type '${account}' not supported/implemented for Poloniex`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given account is implemented', async () => {

    ImportMock.mockOther(
      PoloniexSpecs,
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

      result = await poloniexOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Account type '${account}' not supported/implemented for Poloniex`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure account orderTypes has given order type', async () => {

    const accountIndex = PoloniexSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    const limitOrderType = poloniexExchangeOrderTypes[0]

    ImportMock.mockOther(
      PoloniexSpecs.accounts[accountIndex],
      'orderTypes',
      [
        limitOrderType,
      ],
    )

    const type = 'unsupported-type'

    let result
    let error


    try {

      result = await poloniexOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type: type as AlunaOrderTypesEnum,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Order type '${type}' not supported/implemented for Poloniex`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given order type is supported', async () => {

    const accountIndex = PoloniexSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      PoloniexSpecs.accounts[accountIndex],
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

      result = await poloniexOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Order type '${type}' not supported/implemented for Poloniex`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given order type is implemented', async () => {

    const accountIndex = PoloniexSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      PoloniexSpecs.accounts[accountIndex],
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

      result = await poloniexOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Order type '${type}' not supported/implemented for Poloniex`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given order type has write mode', async () => {

    const accountIndex = PoloniexSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      PoloniexSpecs.accounts[accountIndex],
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

      result = await poloniexOrderWriteModule.place({
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
      poloniexOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const mockedError: AlunaError = new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: 'Something went wrong, order not canceled',
      metadata: {},
      httpStatusCode: 500,
    })

    const getMock = ImportMock.mockFunction(
      poloniexOrderWriteModule,
      'get',
      Promise.resolve(POLONIEX_RAW_LIMIT_ORDER),
    )

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
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

      result = await poloniexOrderWriteModule.cancel(cancelParams)

    } catch (err) {

      error = err


    }

    expect(result).not.to.be.ok

    expect(getMock.callCount).to.be.eq(1)

    expect(requestMock.callCount).to.be.eq(1)


    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq('Something went wrong, order not canceled')
    expect(error.httpStatusCode).to.be.eq(500)
    expect(error.code).to.be.eq(AlunaOrderErrorCodes.CANCEL_FAILED)

  })



  it('should cancel an open order just fine', async () => {

    ImportMock.mockOther(
      poloniexOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )


    ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
    )

    const getMock = ImportMock.mockFunction(
      poloniexOrderWriteModule,
      'get',
      { status: AlunaOrderStatusEnum.OPEN } as IAlunaOrderSchema,
    )

    const cancelParams: IAlunaOrderCancelParams = {
      id: 'order-id',
      symbolPair: 'symbol-pair',
    }

    let canceledOrder
    let error

    try {

      canceledOrder = await poloniexOrderWriteModule.cancel(cancelParams)

    } catch (err) {

      error = err

    }

    expect(error).to.be.undefined

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.calledWith(cancelParams)).to.be.ok

    expect(canceledOrder).to.be.ok
    expect(canceledOrder).to.deep.eq(getMock.returnValues[0])
    expect(canceledOrder?.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

  })

  it('should edit a poloniex order just fine', async () => {

    const cancelMock = ImportMock.mockFunction(
      poloniexOrderWriteModule,
      'cancel',
      Promise.resolve(true),
    )

    const placeMock = ImportMock.mockFunction(
      poloniexOrderWriteModule,
      'place',
      Promise.resolve(POLONIEX_RAW_LIMIT_ORDER),
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

    const newOrder = await poloniexOrderWriteModule.edit(editOrderParams)

    expect(newOrder).to.deep.eq(POLONIEX_RAW_LIMIT_ORDER)

    expect(cancelMock.callCount).to.be.eq(1)
    expect(placeMock.callCount).to.be.eq(1)

  })

})
