import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderPlaceParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { mockEnsureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported.mock'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { BittrexAuthed } from '../../../BittrexAuthed'
import { BittrexHttp } from '../../../BittrexHttp'
import { getBittrexEndpoints } from '../../../bittrexSpecs'
import { translateOrderSideToBittrex } from '../../../enums/adapters/bittrexOrderSideAdapter'
import { translateOrderTypeToBittrex } from '../../../enums/adapters/bittrexOrderTypeAdapter'
import { BittrexOrderTimeInForceEnum } from '../../../enums/BittrexOrderTimeInForceEnum'
import { BITTREX_RAW_ORDERS } from '../../../test/fixtures/bittrexOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should place a Bittrex limit order just fine', async () => {

    // preparing data
    const mockedRawOrder = BITTREX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const {
      marketSymbol,
      quantity,
      limit,
    } = mockedRawOrder

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.LIMIT

    const translatedOrderSide = translateOrderSideToBittrex({ from: side })
    const translatedOrderType = translateOrderTypeToBittrex({ from: type })

    const body = {
      direction: translatedOrderSide,
      marketSymbol,
      type: translatedOrderType,
      quantity: Number(quantity),
      limit: Number(limit),
      timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
    }

    // mocking

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    const { parse } = mockParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()


    // executing
    const exchange = new BittrexAuthed({ credentials })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: marketSymbol,
      account: AlunaAccountEnum.SPOT,
      amount: Number(quantity),
      side,
      type,
      rate: Number(limit),
    }

    const { order } = await exchange.order.place(params)


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      body,
      credentials,
      url: getBittrexEndpoints(exchange.settings).order.place,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.firstCall.args[0]).to.deep.eq({
      exchangeSpecs: exchange.specs,
      orderParams: params,
    })

  })

  it('should place a Bittrex market order just fine', async () => {

    // preparing data

    const mockedRawOrder = BITTREX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const {
      marketSymbol,
      quantity,
      limit,
    } = mockedRawOrder

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.MARKET

    const translatedOrderSide = translateOrderSideToBittrex({ from: side })
    const translatedOrderType = translateOrderTypeToBittrex({ from: type })

    const body = {
      direction: translatedOrderSide,
      marketSymbol,
      type: translatedOrderType,
      quantity: Number(quantity),
      timeInForce: BittrexOrderTimeInForceEnum.FILL_OR_KILL,
    }

    // mocking
    mockEnsureOrderIsSupported()

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    const { parse } = mockParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()


    // executing
    const exchange = new BittrexAuthed({ credentials })

    const { order } = await exchange.order.place({
      symbolPair: marketSymbol,
      account: AlunaAccountEnum.SPOT,
      amount: Number(quantity),
      side,
      type,
      rate: Number(limit),
    })


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      body,
      credentials,
      url: getBittrexEndpoints(exchange.settings).order.place,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it(
    'should throw error for insufficient funds when placing new bittrex order',
    async () => {

      // preparing data
      const mockedRawOrder = BITTREX_RAW_ORDERS[0]

      const {
        marketSymbol,
        quantity,
        limit,
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
      mockEnsureOrderIsSupported()

      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: BittrexHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()


      // executing
      const exchange = new BittrexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account: AlunaAccountEnum.SPOT,
        amount: Number(quantity),
        side,
        type,
        rate: Number(limit),
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
    'should throw an error placing for minimum value placing new bittrex order',
    async () => {

      // preparing data
      const mockedRawOrder = BITTREX_RAW_ORDERS[0]

      const {
        marketSymbol,
        quantity,
        limit,
      } = mockedRawOrder

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET

      const expectedMessage = 'The amount of quote currency involved in '
        .concat('a transaction would be less ')
        .concat('than the minimum limit of 10K satoshis')
      const expectedCode = AlunaGenericErrorCodes.UNKNOWN

      const alunaError = new AlunaError({
        message: 'dummy-error',
        code: AlunaOrderErrorCodes.PLACE_FAILED,
        httpStatusCode: 401,
        metadata: {
          code: 'DUST_TRADE_DISALLOWED_MIN_VALUE',
        },
      })

      // mocking
      mockEnsureOrderIsSupported()

      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: BittrexHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()


      // executing
      const exchange = new BittrexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account: AlunaAccountEnum.SPOT,
        amount: Number(quantity),
        side,
        type,
        rate: Number(limit),
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
    'should throw an error placing for minimum size placing new bittrex order',
    async () => {

      // preparing data
      const mockedRawOrder = BITTREX_RAW_ORDERS[0]

      const {
        marketSymbol,
        quantity,
        limit,
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
      mockEnsureOrderIsSupported()

      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: BittrexHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()


      // executing
      const exchange = new BittrexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account: AlunaAccountEnum.SPOT,
        amount: Number(quantity),
        side,
        type,
        rate: Number(limit),
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
    'should throw an error placing new bittrex order',
    async () => {

      // preparing data
      const mockedRawOrder = BITTREX_RAW_ORDERS[0]

      const {
        marketSymbol,
        quantity,
        limit,
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
      mockEnsureOrderIsSupported()

      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: BittrexHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()


      // executing
      const exchange = new BittrexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account: AlunaAccountEnum.SPOT,
        amount: Number(quantity),
        side,
        type,
        rate: Number(limit),
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
