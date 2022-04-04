import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { mockExchangeModule } from '../../../../test/helpers/exchange'
import { mockPrivateHttpRequest } from '../../../../test/helpers/http/axios'
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
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderEditParams,
  IAlunaOrderGetParams,
  IAlunaOrderPlaceParams,
} from '../../../lib/modules/IAlunaOrderModule'
import { executeAndCatch } from '../../../utils/executeAndCatch'
import { editOrderParamsSchema } from '../../../utils/validation/schemas/editOrderParamsSchema'
import { placeOrderParamsSchema } from '../../../utils/validation/schemas/placeOrderParamsSchema'
import { mockValidateParams } from '../../../utils/validation/validateParams.mock'
import { BittrexHttp } from '../BittrexHttp'
import {
  BittrexSpecs,
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

    const { validateParamsMock } = mockValidateParams()

    ImportMock.mockOther(
      bittrexOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BittrexHttp,
      'privateRequest',
      Promise.resolve({
        data: placedOrder,
        requestCount: 1,
      }),
    )

    const parseMock = ImportMock.mockFunction(
      bittrexOrderWriteModule,
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

    const requestBody: IBittrexOrderRequest = {
      direction: BittrexSideEnum.BUY,
      marketSymbol: placeOrderParams.symbolPair,
      quantity: Number(placeOrderParams.amount),
      limit: Number(placeOrderParams.rate),
      type: BittrexOrderTypeEnum.LIMIT,
      timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
    }


    // place long limit order
    const {
      order: placeResponse1,
    } = await bittrexOrderWriteModule.place(placeOrderParams)


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

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(validateParamsMock.args[0][0]).to.deep.eq({
      params: placeOrderParams,
      schema: placeOrderParamsSchema,
    })

    // place short limit order

    const placeOrderParams2: IAlunaOrderPlaceParams = {
      amount: 0.001,
      symbolPair: 'ETHZAR',
      side: AlunaOrderSideEnum.SELL,
      type: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody2: IBittrexOrderRequest = {
      direction: BittrexSideEnum.SELL,
      marketSymbol: placeOrderParams.symbolPair,
      type: BittrexOrderTypeEnum.MARKET,
      quantity: Number(placeOrderParams.amount),
      timeInForce: BittrexOrderTimeInForceEnum.FILL_OR_KILL,
    }

    const {
      order: placeResponse2,
    } = await bittrexOrderWriteModule.place(
      placeOrderParams2,
    )

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.args[1][0]).to.deep.eq({
      url: `${PROD_BITTREX_URL}/orders`,
      body: requestBody2,
      keySecret,
    })

    expect(parseMock.callCount).to.be.eq(2)
    expect(parseMock.calledWith({
      rawOrder: placeResponse2,
    })).to.be.ok

    expect(placeResponse2).to.deep.eq(placedOrder)

    expect(validateParamsMock.callCount).to.be.eq(2)
    expect(validateParamsMock.args[1][0]).to.deep.eq({
      params: placeOrderParams2,
      schema: placeOrderParamsSchema,
    })

  })

  it(
    'should throw error code and message for insufficient balance',
    async () => {

      mockExchangeModule({ module: bittrexOrderWriteModule })

      const mockedError: AlunaError = new AlunaError({
        code: 'request-error',
        message: 'Something went wrong.',
        metadata: {
          code: 'INSUFFICIENT_FUNDS',
        },
        httpStatusCode: 500,
      })


      const {
        requestMock,
      } = mockPrivateHttpRequest({
        exchangeHttp: BittrexHttp,
        requestResponse: Promise.reject(mockedError),
        isReject: true,
      })

      const placeOrderParams: IAlunaOrderPlaceParams = {
        amount: 0.001,
        rate: 10000,
        symbolPair: 'ETHZAR',
        side: AlunaOrderSideEnum.BUY,
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

      const {
        error,
        result,
      } = await executeAndCatch(async () => bittrexOrderWriteModule.place(
        placeOrderParams,
      ))

      expect(result).not.to.be.ok
      expect(requestMock.callCount).to.be.eq(1)
      expect(requestMock.calledWith({
        url: `${PROD_BITTREX_URL}/orders`,
        body: requestBody,
        keySecret,
      })).to.be.ok

      const msg = 'Account has insufficient balance for requested action.'

      expect(error!.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
      expect(error!.message).to.be.eq(msg)
      expect(error!.httpStatusCode).to.be.eq(mockedError.httpStatusCode)

    },
  )

  it(
    'should throw error code and message for minimum trade requirement not met',
    async () => {

      mockExchangeModule({ module: bittrexOrderWriteModule })

      const mockedError: AlunaError = new AlunaError({
        code: 'request-error',
        message: 'Something went wrong.',
        metadata: {
          code: 'MIN_TRADE_REQUIREMENT_NOT_MET',
        },
        httpStatusCode: 422,
      })


      const {
        requestMock,
      } = mockPrivateHttpRequest({
        exchangeHttp: BittrexHttp,
        requestResponse: Promise.reject(mockedError),
        isReject: true,
      })

      const placeOrderParams: IAlunaOrderPlaceParams = {
        amount: 0.001,
        rate: 10000,
        symbolPair: 'ETHZAR',
        side: AlunaOrderSideEnum.BUY,
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

      const {
        error,
        result,
      } = await executeAndCatch(async () => bittrexOrderWriteModule.place(
        placeOrderParams,
      ))

      expect(result).not.to.be.ok
      expect(requestMock.callCount).to.be.eq(1)
      expect(requestMock.calledWith({
        url: `${PROD_BITTREX_URL}/orders`,
        body: requestBody,
        keySecret,
      })).to.be.ok

      const msg = 'The trade was smaller than the min trade size quantity for '
        .concat('the market')

      expect(error!.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
      expect(error!.message).to.be.eq(msg)
      expect(error!.httpStatusCode).to.be.eq(mockedError.httpStatusCode)

    },
  )

  it('should throw error code and message for unknown error', async () => {

    mockExchangeModule({ module: bittrexOrderWriteModule })

    const mockedError: AlunaError = new AlunaError({
      code: 'request-error',
      message: 'Something went wrong.',
      metadata: {
        code: 'DUST_TRADE_DISALLOWED_MIN_VALUE',
      },
      httpStatusCode: 400,
    })


    const {
      requestMock,
    } = mockPrivateHttpRequest({
      exchangeHttp: BittrexHttp,
      requestResponse: Promise.reject(mockedError),
      isReject: true,
    })

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 10000,
      symbolPair: 'ETHZAR',
      side: AlunaOrderSideEnum.BUY,
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

    let res = await executeAndCatch(async () => bittrexOrderWriteModule.place(
      placeOrderParams,
    ))

    expect(res.result).not.to.be.ok
    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_BITTREX_URL}/orders`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    let msg = 'The amount of quote currency involved in a transaction '
      .concat('would be less than the minimum limit of 10K satoshis')

    expect(res.error!.code).to.be.eq(AlunaGenericErrorCodes.UNKNOWN)
    expect(res.error!.message).to.be.eq(msg)
    expect(res.error!.httpStatusCode).to.be.eq(mockedError.httpStatusCode)


    requestMock.returns(
      Promise.reject(new AlunaError({
        code: 'request-error',
        message: 'Something went wrong.',
        metadata: {
          code: 'unknown',
        },
        httpStatusCode: 400,
      })),
    )

    res = await executeAndCatch(async () => bittrexOrderWriteModule.place(
      placeOrderParams,
    ))

    expect(res.result).not.to.be.ok
    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_BITTREX_URL}/orders`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    msg = 'Something went wrong.'

    expect(res.error!.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)
    expect(res.error!.message).to.be.eq(msg)
    expect(res.error!.httpStatusCode).to.be.eq(mockedError.httpStatusCode)

  })

  it('should validate exchange specs when placing new orders', async () => {

    await testExchangeSpecsForOrderWriteModule({
      exchangeSpecs: BittrexSpecs,
      orderWriteModule: bittrexOrderWriteModule,
    })

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

    const cancelParams: IAlunaOrderGetParams = {
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
      { data: canceledOrderResponse, requestCount: 1 },
    )

    const parseMock = ImportMock.mockFunction(
      bittrexOrderWriteModule,
      'parse',
      {
        order: {
          status: AlunaOrderStatusEnum.CANCELED,
        },
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

      const { order } = await bittrexOrderWriteModule.cancel(cancelParams)

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

  it('should edit a bittrex order just fine', async () => {

    const { validateParamsMock } = mockValidateParams()

    const cancelMock = ImportMock.mockFunction(
      bittrexOrderWriteModule,
      'cancel',
      Promise.resolve({
        requestCount: 1,
      }),
    )

    const placeMock = ImportMock.mockFunction(
      bittrexOrderWriteModule,
      'place',
      Promise.resolve({
        order: BITTREX_RAW_LIMIT_ORDER,
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
    } = await bittrexOrderWriteModule.edit(editOrderParams)

    expect(newOrder).to.deep.eq(BITTREX_RAW_LIMIT_ORDER)

    expect(cancelMock.callCount).to.be.eq(1)
    expect(placeMock.callCount).to.be.eq(1)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(validateParamsMock.args[0][0]).to.deep.eq({
      params: editOrderParams,
      schema: editOrderParamsSchema,
    })

  })

})
