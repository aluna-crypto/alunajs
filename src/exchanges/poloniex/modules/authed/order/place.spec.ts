import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

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
import { translateOrderSideToPoloniex } from '../../../enums/adapters/poloniexOrderSideAdapter'
import { PoloniexOrderTimeInForceEnum } from '../../../enums/PoloniexOrderTimeInForceEnum'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { IPoloniexOrderPlaceResponseSchema } from '../../../schemas/IPoloniexOrderSchema'
import { POLONIEX_RAW_ORDERS } from '../../../test/fixtures/poloniexOrders'
import * as getMod from './get'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should place a Poloniex limit order just fine', async () => {

    // preparing data
    const mockedRawOrder = POLONIEX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const side = AlunaOrderSideEnum.BUY

    const translatedOrderType = translateOrderSideToPoloniex({
      from: side,
    })

    const body = new URLSearchParams()

    body.append('command', translatedOrderType)
    body.append('currencyPair', '')
    body.append('amount', '0.01')
    body.append('rate', '0')
    body.append(PoloniexOrderTimeInForceEnum.POST_ONLY, '1')
    body.append('nonce', '123456')

    const type = AlunaOrderTypesEnum.LIMIT

    // mocking
    ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      123456,
    )

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    const { get } = mockGet({ module: getMod })

    get.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new PoloniexAuthed({ credentials })

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
      url: getPoloniexEndpoints(exchange.settings).order.place,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

  })

  it(
    'should throw error for insufficient funds when placing new poloniex order',
    async () => {

      // mocking
      const placeResponse: IPoloniexOrderPlaceResponseSchema = {
        clientOrderId: 'clientOrderId',
        fee: 'fee',
        currencyPair: 'BTC_USDC',
        orderNumber: '666',
        resultingTrades: [],
        error: 'Not enough USDC.',
      }

      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: PoloniexHttp.prototype })

      authedRequest.returns(Promise.resolve(placeResponse))

      mockValidateParams()

      mockEnsureOrderIsSupported()


      // executing
      const exchange = new PoloniexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: '',
        account: AlunaAccountEnum.SPOT,
        amount: 0.01,
        side: AlunaOrderSideEnum.BUY,
        type: AlunaOrderTypesEnum.MARKET,
        rate: 0,
      }))


      // validating

      expect(error!.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
      expect(error!.message).to.be.eq(placeResponse.error)
      expect(error!.metadata).to.be.eq(placeResponse)

      expect(authedRequest.callCount).to.be.eq(1)

      expect(publicRequest.callCount).to.be.eq(0)

    },
  )

  it(
    'should throw with proper error code when order placement fails somehow',
    async () => {

      // mocking
      const placeResponse: IPoloniexOrderPlaceResponseSchema = {
        clientOrderId: 'clientOrderId',
        fee: 'fee',
        currencyPair: 'BTC_USDC',
        orderNumber: '666',
        resultingTrades: [],
        error: 'Exchange offline',
      }

      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: PoloniexHttp.prototype })

      authedRequest.returns(Promise.resolve(placeResponse))

      mockValidateParams()

      mockEnsureOrderIsSupported()


      // executing
      const exchange = new PoloniexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: '',
        account: AlunaAccountEnum.SPOT,
        amount: 0.01,
        side: AlunaOrderSideEnum.BUY,
        type: AlunaOrderTypesEnum.MARKET,
        rate: 0,
      }))


      // validating

      expect(error!.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
      expect(error!.message).to.be.eq(placeResponse.error)
      expect(error!.metadata).to.be.eq(placeResponse)

      expect(authedRequest.callCount).to.be.eq(1)

      expect(publicRequest.callCount).to.be.eq(0)

    },
  )

  it('should throw an error placing new poloniex order', async () => {

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
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    authedRequest.returns(Promise.reject(alunaError))

    mockValidateParams()

    mockEnsureOrderIsSupported()


    // executing
    const exchange = new PoloniexAuthed({ credentials })

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
