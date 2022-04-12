import { expect } from 'chai'
import { assign } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { mockExchangeModule } from '../../../../test/helpers/exchange'
import { mockPrivateHttpRequest } from '../../../../test/helpers/http/axios'
import { testExchangeSpecsForOrderWriteModule } from '../../../../test/helpers/orders'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
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
import { editOrderParamsSchema } from '../../../utils/validation/schemas/editOrderParamsSchema'
import { placeOrderParamsSchema } from '../../../utils/validation/schemas/placeOrderParamsSchema'
import { mockValidateParams } from '../../../utils/validation/validateParams.mock'
import { Bitmex } from '../Bitmex'
import { BitmexHttp } from '../BitmexHttp'
import {
  BitmexSpecs,
  PROD_BITMEX_URL,
} from '../BitmexSpecs'
import { BitmexOrderSideAdapter } from '../enums/adapters/BitmexOrderSideAdapter'
import { BitmexOrderTypeAdapter } from '../enums/adapters/BitmexOrderTypeAdapter'
import { BitmexOrderTypeEnum } from '../enums/BitmexOrderTypeEnum'
import { BitmexOrderParser } from '../schemas/parsers/BitmexOrderParser'
import {
  BITMEX_PARSED_ORDERS,
  BITMEX_RAW_ORDERS,
} from '../test/bitmexOrders'
import { BitmexMarketModule } from './BitmexMarketModule'
import { BitmexOrderWriteModule } from './BitmexOrderWriteModule'



describe('BitmexOrderWriteModule', () => {

  const bitmexOrderWriteModule = BitmexOrderWriteModule.prototype

  const rawOrder = BITMEX_RAW_ORDERS[0]
  const parsedOrder = BITMEX_PARSED_ORDERS[0]
  const symbolPair = 'XBTUSD'
  const id = '666'
  const orderAnnotation = 'Sent by aluna'

  const mockRequest = (requestResponse: any, isReject = false) => {

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: BitmexHttp,
      requestResponse,
      isReject,
    })

    const bitmexMarketModuleMock = ImportMock.mockFunction(
      BitmexMarketModule,
      'get',
      {
        market: { instrument: {} },
        requestCount: 1,
      },
    )

    const translateAmountToOrderQtyMock = ImportMock.mockFunction(
      BitmexOrderParser,
      'translateAmountToOrderQty',
      1,
    )

    const parseMock = ImportMock.mockFunction(
      bitmexOrderWriteModule,
      'parse',
      {
        order: parsedOrder,
        requestCount: 1,
      },
    )

    const { validateParamsMock } = mockValidateParams()

    return {
      parseMock,
      requestMock,
      validateParamsMock,
      bitmexMarketModuleMock,
      translateAmountToOrderQtyMock,
    }

  }


  /**
   * Here we can loop through all Bitmex supported accounts and orders types
   * in order to test both place and edit order methods. With this we can
   * shrink this test process.
   */

  const actions: Array<'place' | 'edit'> = ['place', 'edit']

  const orderTypes = [
    AlunaOrderTypesEnum.LIMIT,
    AlunaOrderTypesEnum.MARKET,
    AlunaOrderTypesEnum.STOP_LIMIT,
    AlunaOrderTypesEnum.STOP_MARKET,
  ]

  const sides = Object.values(AlunaOrderSideEnum)

  const promises = actions.map(async (action) => {

    return orderTypes.map(async (type, index) => {

      return sides.map(async (side) => {

        if (action === 'edit' && type === AlunaOrderTypesEnum.MARKET) return

        it(`should ${action} ${type} ${side} order just fine`,
          async () => {

            const amount = (Math.random() * 100) + 1
            const randomRate = (Math.random() * 10) + 1
            const randomStopRate = (Math.random() * 10) + 1
            const randomLimitRate = (Math.random() * 10) + 1

            const { exchangeMock } = mockExchangeModule({
              module: bitmexOrderWriteModule,
            })

            const params: IAlunaOrderPlaceParams = {
              account: AlunaAccountEnum.DERIVATIVES,
              amount,
              side,
              type,
              symbolPair,
            }

            const expectedSide = BitmexOrderSideAdapter.translateToBitmex({
              from: side,
            })

            const expectedType = BitmexOrderTypeAdapter.translateToBitmex({
              from: type,
            })

            const mockedOrderResponse = {
              orderID: id,
              ordType: expectedType,
              symbol: 'XBTUSD',
            }

            const {
              parseMock,
              requestMock,
              validateParamsMock,
              bitmexMarketModuleMock,
              translateAmountToOrderQtyMock,
            } = mockRequest(mockedOrderResponse)

            const getRawMock = ImportMock.mockFunction(
              bitmexOrderWriteModule,
              'getRaw',
              {
                rawOrder: mockedOrderResponse,
                requestCount: 1,
              },
            )

            const expectedRequestBody: Record<string, any> = {
              orderQty: 1,
            }

            if (index % 2 === 0) {

              ImportMock.mockOther(
                Bitmex,
                'settings',
                {
                  mappings: {},
                  orderAnnotation,
                },
              )

              expectedRequestBody.text = orderAnnotation

            }

            let expectedHttpVerb: AlunaHttpVerbEnum

            if (action === 'place') {

              assign(expectedRequestBody, {
                ordType: expectedType,
                side: expectedSide,
                symbol: symbolPair,
              })

              expectedHttpVerb = AlunaHttpVerbEnum.POST

            } else {

              assign(params, { id })

              assign(mockedOrderResponse, {
                id,
              })

              assign(expectedRequestBody, {
                orderID: id,
              })

              expectedHttpVerb = AlunaHttpVerbEnum.PUT

            }

            switch (type) {

              case AlunaOrderTypesEnum.LIMIT:
                params.rate = randomRate
                expectedRequestBody.price = randomRate
                break

              case AlunaOrderTypesEnum.STOP_MARKET:
                params.stopRate = randomStopRate
                expectedRequestBody.stopPx = randomStopRate
                break

              case AlunaOrderTypesEnum.STOP_LIMIT:
                params.stopRate = randomStopRate
                params.limitRate = randomLimitRate
                expectedRequestBody.stopPx = randomStopRate
                expectedRequestBody.price = randomLimitRate
                break

              default:

            }


            let response

            if (action === 'place') {

              const { order } = await bitmexOrderWriteModule.place(params)

              response = order

            } else {

              const { order } = await bitmexOrderWriteModule.edit({
                ...params,
                id,
              })

              response = order

            }

            expect(response).to.deep.eq(parsedOrder)

            expect(requestMock.callCount).to.be.eq(1)
            expect(requestMock.args[0][0]).to.deep.eq({
              url: `${PROD_BITMEX_URL}/order`,
              body: expectedRequestBody,
              keySecret: exchangeMock.getValue().keySecret,
              verb: expectedHttpVerb,
            }).to.be.ok

            expect(translateAmountToOrderQtyMock.callCount).to.be.eq(1)
            expect(translateAmountToOrderQtyMock.args[0][0]).to.deep.eq({
              amount,
              instrument: {},
            })

            const getRawWasCalled = [
              BitmexOrderTypeEnum.STOP_LIMIT,
              BitmexOrderTypeEnum.STOP_MARKET,
            ].includes(expectedType)

            if (getRawWasCalled) {

              const getRawCount = getRawWasCalled
                ? 1
                : 0

              expect(getRawMock.callCount).to.be.eq(getRawCount)
              expect(getRawMock.args[0][0]).to.deep.eq({
                id: mockedOrderResponse.orderID,
                symbolPair: mockedOrderResponse.symbol,
              })

            }

            expect(parseMock.callCount).to.be.eq(1)
            expect(parseMock.args[0][0]).to.deep.eq({
              rawOrder: mockedOrderResponse,
            })

            expect(bitmexMarketModuleMock.callCount).to.be.eq(1)
            expect(bitmexMarketModuleMock.args[0][0]).to.deep.eq({
              id: params.symbolPair,
            })

            expect(validateParamsMock.callCount).to.be.eq(1)

            if (action === 'place') {

              expect(validateParamsMock.args[0][0]).to.deep.eq({
                params,
                schema: placeOrderParamsSchema,
              })

            } else {

              expect(validateParamsMock.args[0][0]).to.deep.eq({
                params,
                schema: editOrderParamsSchema,
              })

            }

          })

      })

    })

  })

  Promise.all(promises)

  it(
    'should throw if there is no enough exchange balance for place/edit order',
    async () => {

      mockExchangeModule({ module: bitmexOrderWriteModule })

      let result
      let error

      const errorMessage = 'insufficient Available Balance'

      const {
        requestMock,
        bitmexMarketModuleMock,
        translateAmountToOrderQtyMock,
      } = mockRequest(
        Promise.reject(new AlunaError({
          code: AlunaHttpErrorCodes.REQUEST_ERROR,
          message: errorMessage,
          httpStatusCode: 400,
        })),
        true,
      )

      const params: IAlunaOrderPlaceParams = {
        account: AlunaAccountEnum.DERIVATIVES,
        amount: 10,
        side: AlunaOrderSideEnum.BUY,
        symbolPair,
        type: AlunaOrderTypesEnum.LIMIT,
        rate: 50,
      }

      try {

        result = await bitmexOrderWriteModule.place(params)

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

        result = await bitmexOrderWriteModule.edit({
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

      expect(bitmexMarketModuleMock.callCount).to.be.eq(2)
      expect(translateAmountToOrderQtyMock.callCount).to.be.eq(2)

    },
  )

  it('should throw when trying to edit nonexistent order', async () => {

    mockExchangeModule({ module: bitmexOrderWriteModule })

    const errorMessage = 'Invalid orderID'

    const {
      requestMock,
      bitmexMarketModuleMock,
      translateAmountToOrderQtyMock,
    } = mockRequest(
      Promise.reject(new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: errorMessage,
        httpStatusCode: 400,
      })),
      true,
    )

    let result
    let error

    const params: IAlunaOrderEditParams = {
      account: AlunaAccountEnum.DERIVATIVES,
      amount: 10,
      side: AlunaOrderSideEnum.BUY,
      symbolPair,
      type: AlunaOrderTypesEnum.LIMIT,
      rate: 50,
      id,
    }

    try {

      result = await bitmexOrderWriteModule.edit(params)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error.message).to.be.eq(errorMessage)
    expect(error.httpStatusCode).to.be.eq(400)

    expect(requestMock.callCount).to.be.eq(1)

    expect(bitmexMarketModuleMock.callCount).to.be.eq(1)

    expect(translateAmountToOrderQtyMock.callCount).to.be.eq(1)

  })

  it("should throw if 'rate' param is missing [LIMIT]", async () => {

    mockExchangeModule({ module: bitmexOrderWriteModule })

    let result
    let error

    const {
      requestMock,
      bitmexMarketModuleMock,
      translateAmountToOrderQtyMock,
    } = mockRequest({})

    let errorMessage = "'rate' param is required to place limit orders"

    const params: IAlunaOrderPlaceParams = {
      account: AlunaAccountEnum.DERIVATIVES,
      amount: 10,
      side: AlunaOrderSideEnum.BUY,
      symbolPair,
      type: AlunaOrderTypesEnum.LIMIT,
    }

    try {

      result = await bitmexOrderWriteModule.place(params)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMessage)
    expect(error.httpStatusCode).to.be.eq(200)


    errorMessage = "'rate' param is required to edit limit orders"

    try {

      result = await bitmexOrderWriteModule.edit({
        ...params,
        id,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMessage)
    expect(error.httpStatusCode).to.be.eq(200)

    expect(requestMock.callCount).to.be.eq(0)
    expect(bitmexMarketModuleMock.callCount).to.be.eq(2)
    expect(translateAmountToOrderQtyMock.callCount).to.be.eq(2)

  })

  it("should throw if 'stopRate' param is missing [STOP-MARKET]", async () => {

    mockExchangeModule({ module: bitmexOrderWriteModule })

    let result
    let error

    const {
      requestMock,
      bitmexMarketModuleMock,
      translateAmountToOrderQtyMock,
    } = mockRequest({})

    let errorMsg = "'stopRate' param is required to place stop-market orders"

    const params: IAlunaOrderPlaceParams = {
      account: AlunaAccountEnum.DERIVATIVES,
      amount: 10,
      side: AlunaOrderSideEnum.BUY,
      symbolPair,
      type: AlunaOrderTypesEnum.STOP_MARKET,
    }

    try {

      result = await bitmexOrderWriteModule.place(params)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMsg)
    expect(error.httpStatusCode).to.be.eq(200)


    errorMsg = "'stopRate' param is required to edit stop-market orders"

    try {

      result = await bitmexOrderWriteModule.edit({
        ...params,
        id,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMsg)
    expect(error.httpStatusCode).to.be.eq(200)

    expect(requestMock.callCount).to.be.eq(0)
    expect(bitmexMarketModuleMock.callCount).to.be.eq(2)
    expect(translateAmountToOrderQtyMock.callCount).to.be.eq(2)

  })

  it("should throw if 'stopRate' param is missing [STOP-LIMIT]", async () => {

    mockExchangeModule({ module: bitmexOrderWriteModule })

    let result
    let error

    const {
      requestMock,
      bitmexMarketModuleMock,
      translateAmountToOrderQtyMock,
    } = mockRequest({})

    let errorMsg = "'stopRate' param is required to place stop-limit orders"

    const params: IAlunaOrderPlaceParams = {
      account: AlunaAccountEnum.DERIVATIVES,
      amount: 10,
      side: AlunaOrderSideEnum.BUY,
      symbolPair,
      type: AlunaOrderTypesEnum.STOP_LIMIT,
      limitRate: 10,
    }

    try {

      result = await bitmexOrderWriteModule.place(params)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMsg)
    expect(error.httpStatusCode).to.be.eq(200)


    errorMsg = "'stopRate' param is required to edit stop-limit orders"

    try {

      result = await bitmexOrderWriteModule.edit({
        ...params,
        id,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMsg)
    expect(error.httpStatusCode).to.be.eq(200)

    expect(requestMock.callCount).to.be.eq(0)
    expect(bitmexMarketModuleMock.callCount).to.be.eq(2)
    expect(translateAmountToOrderQtyMock.callCount).to.be.eq(2)

  })

  it("should throw if 'limitRate' param is missing [STOP-LIMIT]", async () => {

    mockExchangeModule({ module: bitmexOrderWriteModule })

    let result
    let error

    const {
      requestMock,
      bitmexMarketModuleMock,
      translateAmountToOrderQtyMock,
    } = mockRequest({})

    let errorMsg = "'limitRate' param is required to place stop-limit orders"

    const params: IAlunaOrderPlaceParams = {
      account: AlunaAccountEnum.DERIVATIVES,
      amount: 10,
      side: AlunaOrderSideEnum.BUY,
      symbolPair,
      type: AlunaOrderTypesEnum.STOP_LIMIT,
      stopRate: 10,
    }

    try {

      result = await bitmexOrderWriteModule.place(params)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMsg)
    expect(error.httpStatusCode).to.be.eq(200)


    errorMsg = "'limitRate' param is required to edit stop-limit orders"

    try {

      result = await bitmexOrderWriteModule.edit({
        ...params,
        id,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errorMsg)
    expect(error.httpStatusCode).to.be.eq(200)

    expect(requestMock.callCount).to.be.eq(0)
    expect(bitmexMarketModuleMock.callCount).to.be.eq(2)
    expect(translateAmountToOrderQtyMock.callCount).to.be.eq(2)

  })

  it('should properly cancel Bitmex orders', async () => {

    mockExchangeModule({ module: bitmexOrderWriteModule })

    const {
      parseMock,
      requestMock,
      bitmexMarketModuleMock,
      translateAmountToOrderQtyMock,
    } = mockRequest([rawOrder])

    const params: IAlunaOrderGetParams = {
      id,
      symbolPair,
    }

    const { order: canceledOrder } = await bitmexOrderWriteModule.cancel(params)

    expect(canceledOrder).to.deep.eq(parsedOrder)

    expect(parseMock.callCount).to.be.eq(1)
    expect(requestMock.callCount).to.be.eq(1)
    expect(bitmexMarketModuleMock.callCount).to.be.eq(0)
    expect(translateAmountToOrderQtyMock.callCount).to.be.eq(0)

  })

  it('should throw error if cancel request fails to find order', async () => {

    let error
    let result

    mockExchangeModule({ module: bitmexOrderWriteModule })

    const errMsg = 'Invalid orderID'

    const {
      parseMock,
      requestMock,
      bitmexMarketModuleMock,
      translateAmountToOrderQtyMock,
    } = mockRequest([{ error: errMsg }])

    const params: IAlunaOrderGetParams = {
      id,
      symbolPair,
    }

    try {

      result = await bitmexOrderWriteModule.cancel(params)


    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error.message).to.be.eq(errMsg)

    expect(requestMock.callCount).to.be.eq(1)
    expect(parseMock.callCount).to.be.eq(0)
    expect(bitmexMarketModuleMock.callCount).to.be.eq(0)
    expect(translateAmountToOrderQtyMock.callCount).to.be.eq(0)

  })

  it('should throw error if cancel request throws', async () => {

    let error
    let result

    mockExchangeModule({ module: bitmexOrderWriteModule })

    const errMsg = 'Sever is down'

    const {
      parseMock,
      requestMock,
      bitmexMarketModuleMock,
      translateAmountToOrderQtyMock,
    } = mockRequest(Promise.reject(new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: 'Sever is down',
      httpStatusCode: 400,
    })), true)

    const params: IAlunaOrderGetParams = {
      id,
      symbolPair,
    }

    try {

      result = await bitmexOrderWriteModule.cancel(params)


    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)
    expect(error.message).to.be.eq(errMsg)

    expect(requestMock.callCount).to.be.eq(1)
    expect(parseMock.callCount).to.be.eq(0)
    expect(bitmexMarketModuleMock.callCount).to.be.eq(0)
    expect(translateAmountToOrderQtyMock.callCount).to.be.eq(0)

  })

  it('should validate exchange specs when placing new orders', async () => {

    await testExchangeSpecsForOrderWriteModule({
      exchangeSpecs: BitmexSpecs,
      orderWriteModule: bitmexOrderWriteModule,
    })

  })

})
