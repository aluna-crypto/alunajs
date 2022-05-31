import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
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
import { translateOrderSideToHuobi } from '../../../enums/adapters/huobiOrderSideAdapter'
import { translateOrderTypeToHuobi } from '../../../enums/adapters/huobiOrderTypeAdapter'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { HUOBI_RAW_ORDERS } from '../../../test/fixtures/huobiOrders'
import { mockGetHuobiAccountId } from '../../../test/mocks/mockGetHuobiAccountId'
import * as getMod from './get'
import * as getHuobiAccountIdMod from '../helpers/getHuobiAccountId'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const accountId = 123456

  it('should place a Huobi limit order just fine', async () => {
    // preparing data
    const mockedRawOrder = HUOBI_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.LIMIT

    const translatedOrderSide = translateOrderSideToHuobi({ from: side })
    const translatedOrderType = translateOrderTypeToHuobi({ from: type })



    const body = {
      symbol: '',
      type: `${translatedOrderSide}-${translatedOrderType}`,
      'account-id': accountId,
      amount: '0.01',
      source: 'spot-api',
      price: '0',
    }

    // mocking
    const { wrapper: getHuobiAccountId } = mockGetHuobiAccountId({
      module: getHuobiAccountIdMod,
    })

    getHuobiAccountId.onFirstCall().returns(Promise.resolve({ accountId }))

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    const { get } = mockGet({ module: getMod })

    get.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new HuobiAuthed({ credentials })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
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
      url: getHuobiEndpoints(exchange.settings).order.place,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

  })

  it('should place a stop Huobi stop limit order just fine', async () => {
    // preparing data
    const mockedRawOrder = HUOBI_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.STOP_LIMIT

    const translatedOrderSide = translateOrderSideToHuobi({ from: side })
    const translatedOrderType = translateOrderTypeToHuobi({ from: type })



    const body = {
      symbol: '',
      type: `${translatedOrderSide}-${translatedOrderType}`,
      'account-id': accountId,
      amount: '0.01',
      source: 'spot-api',
      price: '1',
      'stop-price': '1',
      operator: 'lte',
    }

    // mocking
    const { wrapper: getHuobiAccountId } = mockGetHuobiAccountId({
      module: getHuobiAccountIdMod,
    })

    getHuobiAccountId.onFirstCall().returns(Promise.resolve({ accountId }))

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    const { get } = mockGet({ module: getMod })

    get.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new HuobiAuthed({ credentials })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
      side,
      type,
      rate: 0,
      stopRate: 1,
      limitRate: 1,
    }

    const { order } = await exchange.order.place(params)


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      body,
      credentials,
      url: getHuobiEndpoints(exchange.settings).order.place,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

  })

  it('should place a Huobi market order just fine', async () => {

    // preparing data

    const mockedRawOrder = HUOBI_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.MARKET

    const translatedOrderSide = translateOrderSideToHuobi({ from: side })
    const translatedOrderType = translateOrderTypeToHuobi({ from: type })

    const body = {
      symbol: '',
      type: `${translatedOrderSide}-${translatedOrderType}`,
      'account-id': accountId,
      amount: '0.01',
      source: 'spot-api',
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    const { wrapper: getHuobiAccountId } = mockGetHuobiAccountId({
      module: getHuobiAccountIdMod,
    })

    getHuobiAccountId.onFirstCall().returns(Promise.resolve({ accountId }))

    const { get } = mockGet({ module: getMod })

    get.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()

    mockEnsureOrderIsSupported()


    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { order } = await exchange.order.place({
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
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
      url: getHuobiEndpoints(exchange.settings).order.place,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it(
    'should throw error for insufficient funds when placing new huobi order',
    async () => {

      // preparing data
      // const mockedRawOrder = HUOBI_RAW_ORDERS[0]

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET

      const expectedMessage = 'Account has insufficient balance '
        .concat('for requested action.')
      const expectedCode = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      const { wrapper: getHuobiAccountId } = mockGetHuobiAccountId({
        module: getHuobiAccountIdMod,
      })

      getHuobiAccountId.onFirstCall().returns(Promise.resolve({ accountId }))

      const alunaError = new AlunaError({
        message: 'dummy-error',
        code: AlunaOrderErrorCodes.PLACE_FAILED,
        httpStatusCode: 401,
        metadata: {
          'err-code': 'account-frozen-balance-insufficient-error',
        },
      })

      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: HuobiHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()

      mockEnsureOrderIsSupported()


      // executing
      const exchange = new HuobiAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: '',
        account: AlunaAccountEnum.SPOT,
        amount: 0.01,
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

  it('should throw an error placing new huobi order', async () => {

    // preparing data
    // const mockedRawOrder = HUOBI_RAW_ORDERS[0]

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
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    authedRequest.returns(Promise.reject(alunaError))

    const { wrapper: getHuobiAccountId } = mockGetHuobiAccountId({
      module: getHuobiAccountIdMod,
    })

    getHuobiAccountId.onFirstCall().returns(Promise.resolve({ accountId }))

    mockValidateParams()

    mockEnsureOrderIsSupported()


    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { error } = await executeAndCatch(() => exchange.order.place({
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
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
