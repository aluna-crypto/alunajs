import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderPlaceParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { mockEnsureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported.mock'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { translateOrderSideToValr } from '../../../enums/adapters/valrOrderSideAdapter'
import { translateOrderTypeToValr } from '../../../enums/adapters/valrOrderTypeAdapter'
import { ValrOrderTimeInForceEnum } from '../../../enums/ValrOderTimeInForceEnum'
import { ValrOrderStatusEnum } from '../../../enums/ValrOrderStatusEnum'
import { VALR_RAW_ORDERS } from '../../../test/fixtures/valrOrders'
import { ValrAuthed } from '../../../ValrAuthed'
import { ValrHttp } from '../../../ValrHttp'
import { getValrEndpoints } from '../../../valrSpecs'
import * as getMod from './get'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should place a Valr limit order just fine', async () => {

    // preparing data
    const mockedRawOrder = VALR_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const {
      originalQuantity: quantity,
    } = mockedRawOrder

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.LIMIT

    const translatedOrderSide = translateOrderSideToValr({ from: side })
    const translatedOrderType = translateOrderTypeToValr({ from: type })

    const body = {
      side: translatedOrderSide,
      pair: '',
      quantity: Number(quantity),
      price: 0,
      postOnly: false,
      timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })

    const { get } = mockGet({ module: getMod })

    get.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new ValrAuthed({ credentials })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: Number(quantity),
      side,
      type,
      rate: 0,
    }

    const { order } = await exchange.order.place(params)


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      body,
      credentials,
      url: getValrEndpoints(exchange.settings).order.place(translatedOrderType),
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

  })

  it('should place a Valr market order just fine', async () => {

    // preparing data

    const mockedRawOrder = VALR_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const {
      originalQuantity: quantity,
    } = mockedRawOrder

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.MARKET

    const translatedOrderSide = translateOrderSideToValr({ from: side })
    const translatedOrderType = translateOrderTypeToValr({ from: type })

    const body = {
      side: translatedOrderSide,
      pair: '',
      baseAmount: Number(quantity),
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })

    const { get } = mockGet({ module: getMod })

    get.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()

    mockEnsureOrderIsSupported()


    // executing
    const exchange = new ValrAuthed({ credentials })

    const { order } = await exchange.order.place({
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: Number(quantity),
      side,
      type,
      rate: 0,
    })


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      body,
      credentials,
      url: getValrEndpoints(exchange.settings).order.place(translatedOrderType),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it(
    'should throw error when placing new valr order',
    async () => {

      // preparing data
      const mockedRawOrder = VALR_RAW_ORDERS[0]

      const {
        originalQuantity: quantity,
        orderId: id,
      } = mockedRawOrder

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET

      const expectedMessage = 'dummy-error'
      const expectedCode = AlunaOrderErrorCodes.PLACE_FAILED

      const placeResponse = {
        id,
      }

      const orderResponse = {
        order: {
          meta: {
            orderStatusType: ValrOrderStatusEnum.FAILED,
            failedReason: 'dummy-error',
          },
        },
      }

      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: ValrHttp.prototype })

      const { get } = mockGet(
        {
          module: getMod,
        },
      )

      authedRequest.returns(Promise.resolve(placeResponse))
      get.returns(Promise.resolve(orderResponse))

      mockValidateParams()

      mockEnsureOrderIsSupported()


      // executing
      const exchange = new ValrAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: '',
        account: AlunaAccountEnum.SPOT,
        amount: Number(quantity),
        side,
        type,
        rate: 0,
      }))

      // validating

      expect(error instanceof AlunaError).to.be.ok
      expect(error?.code).to.be.eq(expectedCode)
      expect(error?.message).to.be.eq(expectedMessage)

      expect(authedRequest.callCount).to.be.eq(1)

      expect(publicRequest.callCount).to.be.eq(0)

    },
  )

  it(
    'should throw error when placing new valr order',
    async () => {

      // preparing data
      const mockedRawOrder = VALR_RAW_ORDERS[0]

      const {
        originalQuantity: quantity,
        orderId: id,
      } = mockedRawOrder

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET

      const expectedMessage = 'Insufficient Balance'
      const expectedCode = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      const placeResponse = {
        id,
      }

      const orderResponse = {
        order: {
          meta: {
            orderStatusType: ValrOrderStatusEnum.FAILED,
            failedReason: 'Insufficient Balance',
          },
        },
      }

      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: ValrHttp.prototype })

      const { get } = mockGet(
        {
          module: getMod,
        },
      )

      authedRequest.returns(Promise.resolve(placeResponse))
      get.returns(Promise.resolve(orderResponse))

      mockValidateParams()

      mockEnsureOrderIsSupported()


      // executing
      const exchange = new ValrAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: '',
        account: AlunaAccountEnum.SPOT,
        amount: Number(quantity),
        side,
        type,
        rate: 0,
      }))

      // validating

      expect(error instanceof AlunaError).to.be.ok
      expect(error?.code).to.be.eq(expectedCode)
      expect(error?.message).to.be.eq(expectedMessage)

      expect(authedRequest.callCount).to.be.eq(1)

      expect(publicRequest.callCount).to.be.eq(0)

    },
  )

})
