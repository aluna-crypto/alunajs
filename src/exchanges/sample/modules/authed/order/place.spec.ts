import { expect } from 'chai'

import { testExchangeSpecsForOrderWriteModule } from '../../../../../../test/helpers/orders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockOrderParse } from '../../../../../../test/mocks/exchange/modules/order/mockOrderParse'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { translateOrderSideToSample } from '../../../enums/adapters/sampleOrderSideAdapter'
import { translateOrderTypeToSample } from '../../../enums/adapters/sampleOrderTypeAdapter'
import { SampleOrderTimeInForceEnum } from '../../../enums/SampleOrderTimeInForceEnum'
import { SampleAuthed } from '../../../SampleAuthed'
import { SampleHttp } from '../../../SampleHttp'
import {
  SAMPLE_PRODUCTION_URL,
  sampleBaseSpecs,
} from '../../../sampleSpecs'
import {
  SAMPLE_PARSED_ORDERS,
  SAMPLE_RAW_ORDERS,
} from '../../../test/fixtures/sampleOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should place a Sample limit order just fine', async () => {

    // preparing data
    const mockedRawOrder = SAMPLE_RAW_ORDERS[0]
    const mockedParsedOrder = SAMPLE_PARSED_ORDERS[0]

    const {
      marketSymbol,
      quantity,
      limit,
    } = mockedRawOrder

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.LIMIT

    const translatedOrderSide = translateOrderSideToSample({ from: side })
    const translatedOrderType = translateOrderTypeToSample({ from: type })

    const body = {
      direction: translatedOrderSide,
      marketSymbol,
      type: translatedOrderType,
      quantity: Number(quantity),
      limit: Number(limit),
      timeInForce: SampleOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: SampleHttp.prototype })

    const { parse } = mockOrderParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()


    // executing
    const exchange = new SampleAuthed({ credentials })

    const { order } = await exchange.order.place({
      symbolPair: marketSymbol,
      account: AlunaAccountEnum.EXCHANGE,
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
      url: `${SAMPLE_PRODUCTION_URL}/orders`,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should place a Sample market order just fine', async () => {

    // preparing data

    const mockedRawOrder = SAMPLE_RAW_ORDERS[0]
    const mockedParsedOrder = SAMPLE_PARSED_ORDERS[0]

    const {
      marketSymbol,
      quantity,
      limit,
    } = mockedRawOrder

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.MARKET

    const translatedOrderSide = translateOrderSideToSample({ from: side })
    const translatedOrderType = translateOrderTypeToSample({ from: type })

    const body = {
      direction: translatedOrderSide,
      marketSymbol,
      type: translatedOrderType,
      quantity: Number(quantity),
      timeInForce: SampleOrderTimeInForceEnum.FILL_OR_KILL,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: SampleHttp.prototype })

    const { parse } = mockOrderParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()


    // executing
    const exchange = new SampleAuthed({ credentials })

    const { order } = await exchange.order.place({
      symbolPair: marketSymbol,
      account: AlunaAccountEnum.EXCHANGE,
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
      url: `${SAMPLE_PRODUCTION_URL}/orders`,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it(
    'should throw error for insufficient funds when placing new sample order',
    async () => {

      // preparing data
      const mockedRawOrder = SAMPLE_RAW_ORDERS[0]

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
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: SampleHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()


      // executing
      const exchange = new SampleAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account: AlunaAccountEnum.EXCHANGE,
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
    'should throw an error placing for minimum value placing new sample order',
    async () => {

      // preparing data
      const mockedRawOrder = SAMPLE_RAW_ORDERS[0]

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
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: SampleHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()


      // executing
      const exchange = new SampleAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account: AlunaAccountEnum.EXCHANGE,
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
    'should throw an error placing for minimum size placing new sample order',
    async () => {

      // preparing data
      const mockedRawOrder = SAMPLE_RAW_ORDERS[0]

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
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: SampleHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()


      // executing
      const exchange = new SampleAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account: AlunaAccountEnum.EXCHANGE,
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
    'should throw an error placing new sample order',
    async () => {

      // preparing data
      const mockedRawOrder = SAMPLE_RAW_ORDERS[0]

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
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: SampleHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()


      // executing
      const exchange = new SampleAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account: AlunaAccountEnum.EXCHANGE,
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

  it('should ensure Bittrex order specs are properly validated', async () => {

    // preparing data
    const exchange = new SampleAuthed({
      credentials,
    })

    // executing
    await testExchangeSpecsForOrderWriteModule({
      exchangeSpecs: sampleBaseSpecs,
      orderWriteModule: exchange.order,
    })

  })

})
