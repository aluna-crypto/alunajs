import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
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
import { translateOrderSideToBitfinex } from '../../../enums/adapters/bitfinexOrderSideAdapter'
import { translateOrderTypeToBitfinex } from '../../../enums/adapters/bitfinexOrderTypeAdapter'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { BITFINEX_RAW_ORDERS } from '../../../test/fixtures/bitfinexOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should place a Bitfinex limit order just fine', async () => {

    // preparing data
    const mockedRawOrder = BITFINEX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const {
      quantity,
    } = mockedRawOrder

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.LIMIT

    const translatedOrderSide = translateOrderSideToBitfinex({ from: side })
    const translatedOrderType = translateOrderTypeToBitfinex({ from: type })

    const body = {
      direction: translatedOrderSide,
      marketSymbol: '',
      type: translatedOrderType,
      quantity: Number(quantity),
      rate: 0,
      // limit: 0,
      // timeInForce: BitfinexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    const { parse } = mockParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: '',
      account: AlunaAccountEnum.EXCHANGE,
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
      url: bitfinexEndpoints.order.place,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

  })

  it('should place a Bitfinex market order just fine', async () => {

    // preparing data

    const mockedRawOrder = BITFINEX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const {
      quantity,
    } = mockedRawOrder

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.MARKET

    const translatedOrderSide = translateOrderSideToBitfinex({ from: side })
    const translatedOrderType = translateOrderTypeToBitfinex({ from: type })

    const body = {
      direction: translatedOrderSide,
      marketSymbol: '',
      type: translatedOrderType,
      quantity: Number(quantity),
      rate: 0,
      // timeInForce: BitfinexOrderTimeInForceEnum.FILL_OR_KILL,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    const { parse } = mockParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()

    mockEnsureOrderIsSupported()


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { order } = await exchange.order.place({
      symbolPair: '',
      account: AlunaAccountEnum.EXCHANGE,
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
      url: bitfinexEndpoints.order.place,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it(
    'should throw error for insufficient funds when placing new bitfinex order',
    async () => {

      // preparing data
      const mockedRawOrder = BITFINEX_RAW_ORDERS[0]

      const {
        quantity,
      } = mockedRawOrder

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET

      const expectedMessage = 'Account has insufficient balance '
        .concat('for requested action.')
      const expectedCode = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      const alunaError = new AlunaError({
        message: 'dummy-error',
        code: AlunaOrderErrorCodes.PLACE_FAILED,
        httpStatusCode: 401,
        metadata: {
          code: 'INSUFFICIENT_FUNDS',
        },
      })

      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: BitfinexHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()

      mockEnsureOrderIsSupported()


      // executing
      const exchange = new BitfinexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: '',
        account: AlunaAccountEnum.EXCHANGE,
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
    'should throw an error placing for minimum size placing new bitfinex order',
    async () => {

      // preparing data
      const mockedRawOrder = BITFINEX_RAW_ORDERS[0]

      const {
        quantity,
      } = mockedRawOrder

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET

      const expectedMessage = 'The trade was smaller than the min '
        .concat('trade size quantity for the market')
      const expectedCode = AlunaOrderErrorCodes.PLACE_FAILED

      const alunaError = new AlunaError({
        message: 'dummy-error',
        code: AlunaOrderErrorCodes.PLACE_FAILED,
        httpStatusCode: 401,
        metadata: {
          code: 'MIN_TRADE_REQUIREMENT_NOT_MET',
        },
      })

      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: BitfinexHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()

      mockEnsureOrderIsSupported()


      // executing
      const exchange = new BitfinexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: '',
        account: AlunaAccountEnum.EXCHANGE,
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

  it('should throw an error placing new bitfinex order', async () => {

    // preparing data
    const mockedRawOrder = BITFINEX_RAW_ORDERS[0]

    const {
      quantity,
    } = mockedRawOrder

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.MARKET

    const expectedMessage = 'dummy-error'
    const expectedCode = AlunaOrderErrorCodes.PLACE_FAILED

    const alunaError = new AlunaError({
      message: 'dummy-error',
      code: AlunaOrderErrorCodes.PLACE_FAILED,
      httpStatusCode: 401,
      metadata: {},
    })

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.returns(Promise.reject(alunaError))

    mockValidateParams()

    mockEnsureOrderIsSupported()


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { error } = await executeAndCatch(() => exchange.order.place({
      symbolPair: '',
      account: AlunaAccountEnum.EXCHANGE,
      amount: Number(quantity),
      side,
      type,
      rate: Number(0),
    }))

    // validating
    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(expectedCode)
    expect(error?.message).to.be.eq(expectedMessage)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
