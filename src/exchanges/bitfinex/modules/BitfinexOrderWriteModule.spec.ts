import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { testExchangeSpecsForOrderWriteModule } from '../../../../test/helpers/orders'
import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaKeySecretSchema } from '../../../lib/schemas/IAlunaKeySecretSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexSpecs } from '../BitfinexSpecs'
import { BitfinexOrderSideAdapter } from '../enums/adapters/BitfinexOrderSideAdapter'
import { BitfinexOrderTypeAdapter } from '../enums/adapters/BitfinexOrderTypeAdapter'
import { IBitfinexOrderSchema } from '../schemas/IBitfinexOrderSchema'
import {
  BITFINEX_PARSED_ORDERS,
  BITFINEX_RAW_ORDERS,
} from '../test/fixtures/bitfinexOrders'
import { BitfinexOrderWriteModule } from './BitfinexOrderWriteModule'



describe('BitfinexOrderWriteModule', () => {

  const bitfinexOrderWriteModule = BitfinexOrderWriteModule.prototype

  const keySecret: IAlunaKeySecretSchema = {
    key: '',
    secret: '',
  }

  const symbolPair = 'tETHBTC'
  const id = '666'

  const mockKeySecret = () => {

    const exchangeMock = ImportMock.mockOther(
      bitfinexOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    return { exchangeMock }

  }

  const mockRequest = (requestResponse: any) => {

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      requestResponse,
    )

    return { requestMock }

  }

  const getMockedBitfinexOrderResponse = (params: {
    isPlace?: boolean,
    status?: string,
    text?: string,
    rawOrder?: IBitfinexOrderSchema | undefined,
  }) => {

    const {
      isPlace = true,
      status = 'SUCCESS',
      text = 'Dummy text',
      rawOrder,
    } = params

    const returnedOrder = isPlace
      ? [rawOrder]
      : rawOrder

    const placeOrderMockResponse = [
      Date.now(),
      'dummy-type',
      '666',
      null,
      returnedOrder,
      666,
      status,
      text,
    ]

    return { placeOrderMockResponse }

  }


  const mockEditOrPlaceSuccess = (
    action: 'place' | 'edit',
  ) => {

    const rawOrder = BITFINEX_RAW_ORDERS[0]

    const parsedOrder = BITFINEX_PARSED_ORDERS[0]

    const { placeOrderMockResponse } = getMockedBitfinexOrderResponse({
      isPlace: action === 'place',
      rawOrder,
    })

    const { exchangeMock } = mockKeySecret()

    const { requestMock } = mockRequest(Promise.resolve(placeOrderMockResponse))

    const parseMock = ImportMock.mockFunction(
      bitfinexOrderWriteModule,
      'parse',
      parsedOrder,
    )

    return {
      exchangeMock,
      requestMock,
      parseMock,
      parsedOrder,
      rawOrder,
    }

  }



  /**
   * Here we can loop through all Bitfinex supported accounts and orders types
   * in order to test both place and edit order methods. With this we can
   * shrink this test process.
   */

  const actions: Array<'place' | 'edit'> = ['place', 'edit']

  const accounts = [
    AlunaAccountEnum.EXCHANGE,
    AlunaAccountEnum.MARGIN,
  ]

  const orderTypes = [
    AlunaOrderTypesEnum.LIMIT,
    AlunaOrderTypesEnum.MARKET,
    AlunaOrderTypesEnum.STOP_LIMIT,
    AlunaOrderTypesEnum.STOP_MARKET,
  ]

  const sides = Object.values(AlunaOrderSideEnum)

  const promises = actions.map(async (action) => {

    return accounts.map(async (account) => {

      return orderTypes.map(async (type) => {

        return sides.map(async (side) => {

          if (action === 'edit' && type === AlunaOrderTypesEnum.MARKET) return

          it(`should ${action} ${account} ${type} ${side} order just fine`,
            async () => {

              const {
                parseMock,
                requestMock,
                parsedOrder,
              } = mockEditOrPlaceSuccess(action)

              const amount = (Math.random() * 100) + 1
              const randomRate = (Math.random() * 10) + 1
              const randomStopRate = (Math.random() * 10) + 1
              const randomLimitRate = (Math.random() * 10) + 1

              const params: IAlunaOrderPlaceParams = {
                account,
                amount,
                side,
                type,
                symbolPair,
              }

              const expectedAmount = BitfinexOrderSideAdapter
                .translateToBitfinex({
                  amount,
                  side,
                })

              const expectedType = BitfinexOrderTypeAdapter
                .translateToBitfinex({
                  account,
                  from: type,
                })

              const expectedRequestBody: Record<string, any> = {
                amount: expectedAmount,
              }

              let expectedUrl: string

              if (action === 'place') {

                expectedRequestBody.type = expectedType
                expectedRequestBody.symbol = symbolPair

                expectedUrl = 'https://api.bitfinex.com/v2/auth/w/order/submit'

              } else {

                expectedRequestBody.id = id

                expectedUrl = 'https://api.bitfinex.com/v2/auth/w/order/update'

              }

              switch (type) {

                case AlunaOrderTypesEnum.LIMIT:
                  params.rate = randomRate
                  expectedRequestBody.price = randomRate.toString()
                  break

                case AlunaOrderTypesEnum.STOP_MARKET:
                  params.stopRate = randomStopRate
                  expectedRequestBody.price = randomStopRate.toString()
                  break

                case AlunaOrderTypesEnum.STOP_LIMIT: {

                  const randomLimitRateStr = randomLimitRate.toString()

                  params.stopRate = randomStopRate
                  params.limitRate = randomLimitRate
                  expectedRequestBody.price = randomStopRate.toString()
                  expectedRequestBody.price_aux_limit = randomLimitRateStr

                  break

                }

                default:

              }

              let response

              if (action === 'place') {

                response = await bitfinexOrderWriteModule.place(params)


              } else {

                response = await bitfinexOrderWriteModule.edit({
                  ...params,
                  id,
                })

              }

              expect(response).to.deep.eq(parsedOrder)

              expect(requestMock.callCount).to.be.eq(1)
              expect(requestMock.args[0][0]).to.deep.eq({
                url: expectedUrl,
                body: expectedRequestBody,
                keySecret,
              }).to.be.ok

              expect(parseMock.callCount).to.be.eq(1)

            })

        })

      })

    })

  })

  Promise.all(promises)



  it(
    "should throw if Bitfinex place order response is not 'SUCCESS'",
    async () => {

      mockKeySecret()

      let result
      let error

      const text = 'Order placement fails for some reason'

      const { placeOrderMockResponse } = getMockedBitfinexOrderResponse({
        status: 'FAIL',
        text,
      })

      const {
        requestMock,
      } = mockRequest(Promise.resolve(placeOrderMockResponse))

      try {

        result = await bitfinexOrderWriteModule.place({
          account: AlunaAccountEnum.EXCHANGE,
          amount: 10,
          side: AlunaOrderSideEnum.BUY,
          symbolPair: 'tETHBTC',
          type: AlunaOrderTypesEnum.LIMIT,
          rate: 50,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok
      expect(error.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
      expect(error.message).to.be.eq(text)
      expect(error.httpStatusCode).to.be.eq(400)

      expect(requestMock.callCount).to.be.eq(1)


    },
  )

  it("should throw if Bitfinex edit order response is not 'SUCCESS'",
    async () => {

      mockKeySecret()

      let result
      let error

      const text = 'Order placement fails for some reason'

      const { placeOrderMockResponse } = getMockedBitfinexOrderResponse({
        isPlace: false,
        status: 'FAIL',
        text,
      })

      const {
        requestMock,
      } = mockRequest(Promise.resolve(placeOrderMockResponse))
      try {

        result = await bitfinexOrderWriteModule.edit({
          account: AlunaAccountEnum.EXCHANGE,
          amount: 10,
          side: AlunaOrderSideEnum.BUY,
          symbolPair: 'tETHBTC',
          type: AlunaOrderTypesEnum.LIMIT,
          rate: 50,
          id,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok
      expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)
      expect(error.message).to.be.eq(text)
      expect(error.httpStatusCode).to.be.eq(400)

      expect(requestMock.callCount).to.be.eq(1)

    })

  it(
    'should throw if there is no enough exchange balance for place/edit order',
    async () => {

      mockKeySecret()

      let result
      let error

      let errorMessage = 'Not enough exchange balance for'

      const { requestMock } = mockRequest(
        Promise.reject(new AlunaError({
          code: AlunaHttpErrorCodes.REQUEST_ERROR,
          message: errorMessage,
          httpStatusCode: 400,
        })),
      )

      const params: IAlunaOrderPlaceParams = {
        account: AlunaAccountEnum.EXCHANGE,
        amount: 10,
        side: AlunaOrderSideEnum.BUY,
        symbolPair: 'tETHBTC',
        type: AlunaOrderTypesEnum.LIMIT,
        rate: 50,
      }

      try {

        result = await bitfinexOrderWriteModule.place(params)

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok
      expect(error.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
      expect(error.message).to.be.eq(errorMessage)
      expect(error.httpStatusCode).to.be.eq(400)

      expect(requestMock.callCount).to.be.eq(1)

      error = undefined

      try {

        result = await bitfinexOrderWriteModule.edit({
          ...params,
          id,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok
      expect(error.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
      expect(error.message).to.be.eq(errorMessage)
      expect(error.httpStatusCode).to.be.eq(400)

      expect(requestMock.callCount).to.be.eq(2)

      error = undefined

      errorMessage = 'Not enough tradable balance for'

      requestMock.returns(
        Promise.reject(new AlunaError({
          code: AlunaHttpErrorCodes.REQUEST_ERROR,
          message: errorMessage,
          httpStatusCode: 400,
        })),
      )

      try {

        result = await bitfinexOrderWriteModule.place(params)

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok
      expect(error.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
      expect(error.message).to.be.eq(errorMessage)
      expect(error.httpStatusCode).to.be.eq(400)

      expect(requestMock.callCount).to.be.eq(3)


      error = undefined

      try {

        result = await bitfinexOrderWriteModule.edit({
          ...params,
          id,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok
      expect(error.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
      expect(error.message).to.be.eq(errorMessage)
      expect(error.httpStatusCode).to.be.eq(400)

      expect(requestMock.callCount).to.be.eq(4)

    },
  )

  it('should throw when trying to edit nonexistent order', async () => {

    mockKeySecret()

    let result
    let error

    const errorMessage = 'order: invalid'

    const { requestMock } = mockRequest(
      Promise.reject(new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: errorMessage,
        httpStatusCode: 400,
      })),
    )

    const params: IAlunaOrderEditParams = {
      account: AlunaAccountEnum.EXCHANGE,
      amount: 10,
      side: AlunaOrderSideEnum.BUY,
      symbolPair: 'tETHBTC',
      type: AlunaOrderTypesEnum.LIMIT,
      rate: 50,
      id,
    }

    try {

      result = await bitfinexOrderWriteModule.edit(params)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error.message).to.be.eq('order was not found or may not be open')
    expect(error.httpStatusCode).to.be.eq(400)

    expect(requestMock.callCount).to.be.eq(1)

  })

  it("should throw if 'rate' param is missing [LIMIT]", async () => {

    mockKeySecret()

    let result
    let error

    let errorMessage = "'rate' param is required to place limit orders"

    const params: IAlunaOrderPlaceParams = {
      account: AlunaAccountEnum.EXCHANGE,
      amount: 10,
      side: AlunaOrderSideEnum.BUY,
      symbolPair,
      type: AlunaOrderTypesEnum.LIMIT,
    }

    try {

      result = await bitfinexOrderWriteModule.place(params)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMessage)
    expect(error.httpStatusCode).to.be.eq(422)


    errorMessage = "'rate' param is required to edit limit orders"

    try {

      result = await bitfinexOrderWriteModule.edit({
        ...params,
        id,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMessage)
    expect(error.httpStatusCode).to.be.eq(422)

  })

  it("should throw if 'stopRate' param is missing [STOP-MARKET]", async () => {

    mockKeySecret()

    let result
    let error

    let errorMsg = "'stopRate' param is required to place stop-market orders"

    const params: IAlunaOrderPlaceParams = {
      account: AlunaAccountEnum.EXCHANGE,
      amount: 10,
      side: AlunaOrderSideEnum.BUY,
      symbolPair,
      type: AlunaOrderTypesEnum.STOP_MARKET,
    }

    try {

      result = await bitfinexOrderWriteModule.place(params)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMsg)
    expect(error.httpStatusCode).to.be.eq(422)


    errorMsg = "'stopRate' param is required to edit stop-market orders"

    try {

      result = await bitfinexOrderWriteModule.edit({
        ...params,
        id,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMsg)
    expect(error.httpStatusCode).to.be.eq(422)

  })

  it("should throw if 'stopRate' param is missing [STOP-LIMIT]", async () => {

    mockKeySecret()

    let result
    let error

    let errorMsg = "'stopRate' param is required to place stop-limit orders"

    const params: IAlunaOrderPlaceParams = {
      account: AlunaAccountEnum.EXCHANGE,
      amount: 10,
      side: AlunaOrderSideEnum.BUY,
      symbolPair,
      type: AlunaOrderTypesEnum.STOP_LIMIT,
      limitRate: 10,
    }

    try {

      result = await bitfinexOrderWriteModule.place(params)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMsg)
    expect(error.httpStatusCode).to.be.eq(422)


    errorMsg = "'stopRate' param is required to edit stop-limit orders"

    try {

      result = await bitfinexOrderWriteModule.edit({
        ...params,
        id,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMsg)
    expect(error.httpStatusCode).to.be.eq(422)

  })

  it("should throw if 'limitRate' param is missing [STOP-LIMIT]", async () => {

    mockKeySecret()

    let result
    let error

    let errorMsg = "'limitRate' param is required to place stop-limit orders"

    const params: IAlunaOrderPlaceParams = {
      account: AlunaAccountEnum.EXCHANGE,
      amount: 10,
      side: AlunaOrderSideEnum.BUY,
      symbolPair,
      type: AlunaOrderTypesEnum.STOP_LIMIT,
      stopRate: 10,
    }

    try {

      result = await bitfinexOrderWriteModule.place(params)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMsg)
    expect(error.httpStatusCode).to.be.eq(422)


    errorMsg = "'limitRate' param is required to edit stop-limit orders"

    try {

      result = await bitfinexOrderWriteModule.edit({
        ...params,
        id,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMsg)
    expect(error.httpStatusCode).to.be.eq(422)

  })

  it('should properly cancel Bitfinex orders', async () => {

    mockKeySecret()

    const parsedOrder = BITFINEX_PARSED_ORDERS[0]

    const { placeOrderMockResponse } = getMockedBitfinexOrderResponse({})

    const { requestMock } = mockRequest(Promise.resolve(placeOrderMockResponse))

    const getMock = ImportMock.mockFunction(
      bitfinexOrderWriteModule,
      'get',
      parsedOrder,
    )

    const params: IAlunaOrderCancelParams = {
      id: '10',
      symbolPair: 'tBTCETH',
    }

    const canceledOrder = await bitfinexOrderWriteModule.cancel(params)

    expect(requestMock.callCount).to.be.eq(1)

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.args[0][0]).to.deep.eq(params)

    expect(canceledOrder).to.deep.eq(parsedOrder)

  })

  it('should throw error if order cancel request fails', async () => {

    let error
    let result

    mockKeySecret()

    const parsedOrder = BITFINEX_PARSED_ORDERS[0]

    let errMsg = 'Order not active'

    const { placeOrderMockResponse } = getMockedBitfinexOrderResponse({
      status: 'FAILS',
      text: errMsg,
    })

    // const { requestMock } = mockRequest(

    // )
    const { requestMock } = mockRequest(Promise.resolve(placeOrderMockResponse))

    const getMock = ImportMock.mockFunction(
      bitfinexOrderWriteModule,
      'get',
      parsedOrder,
    )

    const params: IAlunaOrderCancelParams = {
      id: '10',
      symbolPair: 'tBTCETH',
    }

    try {

      result = await bitfinexOrderWriteModule.cancel(params)


    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.CANCEL_FAILED)
    expect(error.message).to.be.eq(errMsg)

    expect(requestMock.callCount).to.be.eq(1)
    expect(getMock.callCount).to.be.eq(0)

    errMsg = 'Order is already canceled'

    requestMock.returns(
      Promise.reject(new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: errMsg,
      })),
    )

    try {

      result = await bitfinexOrderWriteModule.cancel(params)


    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.CANCEL_FAILED)
    expect(error.message).to.be.eq(errMsg)

    expect(requestMock.callCount).to.be.eq(2)
    expect(getMock.callCount).to.be.eq(0)

  })

  it('should validate exchange specs when placing new orders', async () => {

    await testExchangeSpecsForOrderWriteModule({
      exchangeSpecs: BitfinexSpecs,
      orderWriteModule: bitfinexOrderWriteModule,
    })

  })

})
