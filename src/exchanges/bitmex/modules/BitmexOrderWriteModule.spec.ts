import { expect } from 'chai'
import { assign } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../lib/enums/AlunaSideEnum'
import { AlunaBalanceErrorCodes } from '../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
} from '../../../lib/modules/IAlunaOrderModule'
import {
  IAlunaExchangeAccountSpecsSchema,
  IAlunaExchangeOrderOptionsSchema,
} from '../../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaKeySecretSchema } from '../../../lib/schemas/IAlunaKeySecretSchema'
import { BitmexHttp } from '../BitmexHttp'
import {
  BitmexSpecs,
  PROD_BITMEX_URL,
} from '../BitmexSpecs'
import { BitmexOrderTypeAdapter } from '../enums/adapters/BitmexOrderTypeAdapter'
import { BitmexSideAdapter } from '../enums/adapters/BitmexSideAdapter'
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

  const keySecret: IAlunaKeySecretSchema = {
    key: '',
    secret: '',
  }

  const rawOrder = BITMEX_RAW_ORDERS[0]
  const parsedOrder = BITMEX_PARSED_ORDERS[0]
  const symbolPair = 'XBTUSD'
  const id = '666'

  const mockExchange = () => {

    const exchangeMock = ImportMock.mockOther(
      bitmexOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    return { exchangeMock }

  }

  const mockRequest = (requestResponse: any) => {

    const requestMock = ImportMock.mockFunction(
      BitmexHttp,
      'privateRequest',
      requestResponse,
    )

    const bitmexMarketModuleMock = ImportMock.mockFunction(
      BitmexMarketModule,
      'get',
      Promise.resolve({ instrument: {} }),
    )

    const translateAmountToOrderQtyMock = ImportMock.mockFunction(
      BitmexOrderParser,
      'translateAmountToOrderQty',
      1,
    )

    const parseMock = ImportMock.mockFunction(
      bitmexOrderWriteModule,
      'parse',
      Promise.resolve(parsedOrder),
    )

    return {
      parseMock,
      requestMock,
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

  const sides = Object.values(AlunaSideEnum)

  const promises = actions.map(async (action) => {

    return orderTypes.map(async (type) => {

      return sides.map(async (side) => {

        if (action === 'edit' && type === AlunaOrderTypesEnum.MARKET) return

        it(`should ${action} ${type} ${side} order just fine`,
          async () => {

            const amount = (Math.random() * 100) + 1
            const randomRate = (Math.random() * 10) + 1
            const randomStopRate = (Math.random() * 10) + 1
            const randomLimitRate = (Math.random() * 10) + 1

            mockExchange()

            const params: IAlunaOrderPlaceParams = {
              account: AlunaAccountEnum.DERIVATIVES,
              amount,
              side,
              type,
              symbolPair,
            }

            const expectedSide = BitmexSideAdapter.translateToBitmex({
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
              bitmexMarketModuleMock,
              translateAmountToOrderQtyMock,
            } = mockRequest(mockedOrderResponse)

            const getRawMock = ImportMock.mockFunction(
              bitmexOrderWriteModule,
              'getRaw',
              Promise.resolve(mockedOrderResponse),
            )

            const expectedRequestBody: Record<string, any> = {
              orderQty: 1,
              text: 'Sent by Aluna',
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

              response = await bitmexOrderWriteModule.place(params)


            } else {

              response = await bitmexOrderWriteModule.edit({
                ...params,
                id,
              })

            }

            expect(response).to.deep.eq(parsedOrder)

            expect(requestMock.callCount).to.be.eq(1)
            expect(requestMock.args[0][0]).to.deep.eq({
              url: `${PROD_BITMEX_URL}/order`,
              body: expectedRequestBody,
              keySecret,
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
              symbolPair: params.symbolPair,
            })

          })

      })

    })

  })

  Promise.all(promises)

  it(
    'should throw if there is no enough exchange balance for place/edit order',
    async () => {

      mockExchange()

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
      )

      const params: IAlunaOrderPlaceParams = {
        account: AlunaAccountEnum.DERIVATIVES,
        amount: 10,
        side: AlunaSideEnum.LONG,
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

    mockExchange()

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
    )

    let result
    let error

    const params: IAlunaOrderEditParams = {
      account: AlunaAccountEnum.DERIVATIVES,
      amount: 10,
      side: AlunaSideEnum.LONG,
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

    mockExchange()

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
      side: AlunaSideEnum.LONG,
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

    mockExchange()

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
      side: AlunaSideEnum.LONG,
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

    mockExchange()

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
      side: AlunaSideEnum.LONG,
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

    mockExchange()

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
      side: AlunaSideEnum.LONG,
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

    mockExchange()

    const {
      parseMock,
      requestMock,
      bitmexMarketModuleMock,
      translateAmountToOrderQtyMock,
    } = mockRequest(Promise.resolve([rawOrder]))

    const params: IAlunaOrderCancelParams = {
      id,
      symbolPair,
    }

    const canceledOrder = await bitmexOrderWriteModule.cancel(params)

    expect(canceledOrder).to.deep.eq(parsedOrder)

    expect(parseMock.callCount).to.be.eq(1)
    expect(requestMock.callCount).to.be.eq(1)
    expect(bitmexMarketModuleMock.callCount).to.be.eq(0)
    expect(translateAmountToOrderQtyMock.callCount).to.be.eq(0)

  })

  it('should throw error if cancel request fails to find order', async () => {

    let error
    let result

    mockExchange()

    const errMsg = 'Invalid orderID'

    const {
      parseMock,
      requestMock,
      bitmexMarketModuleMock,
      translateAmountToOrderQtyMock,
    } = mockRequest(Promise.resolve([{ error: errMsg }]))

    const params: IAlunaOrderCancelParams = {
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

    mockExchange()

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
    })))

    const params: IAlunaOrderCancelParams = {
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

  it('should ensure given account is one of AlunaAccountEnum', async () => {

    let error

    ImportMock.mockOther(
      BitmexSpecs,
      'accounts',
      [],
    )

    const account = 'nonexistent'

    try {

      await bitmexOrderWriteModule.place({
        account,
      } as unknown as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    const msg = `Account type '${account}' not found`

    expect(error).to.be.ok

    const { message } = error as AlunaError
    expect(message).to.be.eq(msg)

  })

  it('should ensure given account is supported', async () => {

    let error

    ImportMock.mockOther(
      BitmexSpecs,
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

      await bitmexOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    const msg = `Account type '${account}' not supported/implemented for ${BitmexSpecs.name}`

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(msg)

  })

  it('should ensure given account is implemented', async () => {

    let error

    ImportMock.mockOther(
      BitmexSpecs,
      'accounts',
      [
        {
          type: AlunaAccountEnum.DERIVATIVES,
          supported: true,
          implemented: false,
          orderTypes: [],
        },
      ],
    )

    const account = AlunaAccountEnum.DERIVATIVES

    try {

      await bitmexOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    const msg = `Account type '${account}' not supported/implemented for ${BitmexSpecs.name}`

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(msg)

  })

  it('should ensure given account has orderTypes property', async () => {

    let error

    ImportMock.mockOther(
      BitmexSpecs,
      'accounts',
      [
        {
          type: AlunaAccountEnum.DERIVATIVES,
          supported: true,
          implemented: true,
          // missing orderTypes property
        } as IAlunaExchangeAccountSpecsSchema,
      ],
    )

    const account = AlunaAccountEnum.DERIVATIVES

    try {

      await bitmexOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    const msg = `Account type '${account}' not supported/implemented for ${BitmexSpecs.name}`

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(msg)

  })

  it('should ensure account orderTypes has given order type', async () => {

    let error

    const accountIndex = BitmexSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.DERIVATIVES,
    )

    ImportMock.mockOther(
      BitmexSpecs.accounts[accountIndex],
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

    const type = 'unsupported-type'

    try {

      await bitmexOrderWriteModule.place({
        account: AlunaAccountEnum.DERIVATIVES,
        type: type as AlunaOrderTypesEnum,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    const msg = `Order type '${type}' not supported/implemented for ${BitmexSpecs.name}`

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(msg)

  })

  it('should ensure given order type is supported', async () => {

    let error

    const accountIndex = BitmexSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.DERIVATIVES,
    )

    ImportMock.mockOther(
      BitmexSpecs.accounts[accountIndex],
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

      await bitmexOrderWriteModule.place({
        account: AlunaAccountEnum.DERIVATIVES,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    const msg = `Order type '${type}' not supported/implemented for ${BitmexSpecs.name}`

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(msg)

  })

  it('should ensure given order type is implemented', async () => {

    let error

    const accountIndex = BitmexSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.DERIVATIVES,
    )

    ImportMock.mockOther(
      BitmexSpecs.accounts[accountIndex],
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

      await bitmexOrderWriteModule.place({
        account: AlunaAccountEnum.DERIVATIVES,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    const msg = `Order type '${type}' not supported/implemented for ${BitmexSpecs.name}`

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(msg)

  })

  it('should ensure given order type has write mode', async () => {

    let error

    const accountIndex = BitmexSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.DERIVATIVES,
    )

    ImportMock.mockOther(
      BitmexSpecs.accounts[accountIndex],
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

      await bitmexOrderWriteModule.place({
        account: AlunaAccountEnum.DERIVATIVES,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(`Order type '${type}' is in read mode`)

  })

})
