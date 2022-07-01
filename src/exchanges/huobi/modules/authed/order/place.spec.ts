import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import { assign } from 'lodash'
import Sinon from 'sinon'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import {
  IMethodToMock,
  testPlaceOrder,
} from '../../../../../../test/macros/testPlaceOrder'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
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
import * as getMarketMod from '../../public/market/get'
import * as getHuobiAccountIdMod from '../helpers/getHuobiAccountId'
import * as getRawMod from './getRaw'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }


  const accountId = 123456
  const rawOrder = HUOBI_RAW_ORDERS[0]
  const parsedMarket = PARSED_MARKETS[0]

  const getMarketSpy = Sinon.spy(
    async () => Promise.resolve({ market: parsedMarket }),
  )

  const getRawSpy = Sinon.spy(
    async () => Promise.resolve({ rawOrder }),
  )

  const getHuobiAccountIdResponse = Promise.resolve({ accountId })

  const methodsToMock: IMethodToMock[] = [
    {
      methodName: 'get',
      methodModule: getMarketMod,
      methodResponse: getMarketSpy,
    },
    {
      methodName: 'getRaw',
      methodModule: getRawMod,
      methodResponse: getRawSpy,
    },
    {
      methodName: 'getHuobiAccountId',
      methodModule: getHuobiAccountIdMod,
      methodResponse: getHuobiAccountIdResponse,
    },
  ]

  testPlaceOrder({
    ExchangeAuthed: HuobiAuthed,
    HttpClass: HuobiHttp,
    parseModule: parseMod,
    rawOrders: HUOBI_RAW_ORDERS,
    credentials,
    methodsToMock,
    validationCallback: (params) => {

      const {
        exchange,
        placeParams,
        authedRequestStub,
        mockedMethodsDictionary,
      } = params

      const { settings } = exchange

      const {
        type,
        side,
        rate,
        amount,
        stopRate,
        limitRate,
        symbolPair,
        clientOrderId,
      } = placeParams


      const {
        get,
        getRaw,
        getHuobiAccountId,
      } = mockedMethodsDictionary!


      const translatedOrderType = translateOrderTypeToHuobi({
        side,
        type,
      })

      const translatedOrderSide = translateOrderSideToHuobi({
        from: side,
      })

      let url: string
      let orderAmount = amount
      const body = {
        symbol: symbolPair,
      }

      const isMarketOrder = /market/.test(translatedOrderType)

      if (isMarketOrder && (translatedOrderSide === 'buy')) {

        orderAmount = new BigNumber(amount)
          .times(parsedMarket.ticker.last)
          .toNumber()

      }

      const isConditionalOrder = type === AlunaOrderTypesEnum.STOP_LIMIT
        || type === AlunaOrderTypesEnum.STOP_MARKET

      if (isConditionalOrder) {

        url = getHuobiEndpoints(settings).order.placeConditional

        assign(body, {
          accountId,
          clientOrderId,
          orderType: translatedOrderType,
          orderSide: translatedOrderSide,
          stopPrice: stopRate!.toString(),
        })

      } else {

        url = getHuobiEndpoints(settings).order.place

        assign(body, {
          'account-id': accountId,
          ...(clientOrderId ? { 'client-order-id': clientOrderId } : {}),
          type: translatedOrderType,
          amount: orderAmount.toString(),
        })

      }

      switch (type) {

        case AlunaOrderTypesEnum.LIMIT:
          assign(body, { price: rate!.toString() })
          break

        case AlunaOrderTypesEnum.STOP_LIMIT:

          assign(body, {
            orderPrice: limitRate!.toString(),
            orderSize: orderAmount.toString(),
          })
          break

        case AlunaOrderTypesEnum.STOP_MARKET:

          assign(body, { orderValue: orderAmount.toString() })
          break

        default:

      }


      expect(authedRequestStub.firstCall.args[0]).to.deep.eq({
        url,
        body,
        credentials,
      })

      expect(get.callCount).to.be.eq(1)

      if (isMarketOrder && (translatedOrderSide === 'buy')) {

        expect(getMarketSpy.callCount).to.be.eq(1)
        expect(getMarketSpy.firstCall.args).to.deep.eq([{
          symbolPair,
          http: new HuobiHttp(settings),
        }])

      }

      expect(getRaw.callCount).to.be.eq(1)

      expect(getHuobiAccountId.callCount).to.be.eq(1)
      expect(getHuobiAccountId.firstCall.args[0]).to.deep.eq({
        credentials,
        http: new HuobiHttp({}),
        settings,
      })

      getMarketSpy.resetHistory()
      getHuobiAccountId.resetHistory()

    },
  })

  it(
    'should throw error for insufficient funds when placing new huobi order',
    async () => {

      // preparing data

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.LIMIT

      const { wrapper: getHuobiAccountId } = mockGetHuobiAccountId({
        module: getHuobiAccountIdMod,
      })

      getHuobiAccountId.onFirstCall().returns(Promise.resolve({ accountId }))

      const alunaError = new AlunaError({
        message: 'trade account balance is not enough',
        code: AlunaOrderErrorCodes.PLACE_FAILED,
        httpStatusCode: 401,
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

      const {
        error,
        result,
      } = await executeAndCatch(() => exchange.order.place({
        symbolPair: '',
        account: AlunaAccountEnum.SPOT,
        amount: 0.01,
        side,
        type,
        rate: 0,
      }))


      // validating
      expect(result).not.to.be.ok
      const msg = 'Account has insufficient balance for requested action.'

      expect(error!.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
      expect(error!.message).to.be.eq(msg)
      expect(error!.httpStatusCode).to.be.eq(200)

      expect(authedRequest.callCount).to.be.eq(1)

      expect(publicRequest.callCount).to.be.eq(0)

    },
  )

  it('should throw if place order fails somehow', async () => {

    // preparing data

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.LIMIT

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
    expect(error!.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error!.message).to.be.eq('dummy-error')

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error for missing clientOrderId on stop limit order', async () => {

    // preparing data

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.STOP_LIMIT


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

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
    const msg = "param 'clientOrderId' is required for conditional orders"

    expect(error!.message).to.be.eq(msg)
    expect(error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error!.httpStatusCode).to.be.eq(200)

    expect(authedRequest.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error for missing clientOrderId on stop market order', async () => {

    // preparing data
    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.STOP_MARKET


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

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
    const msg = "param 'clientOrderId' is required for conditional orders"

    expect(error!.message).to.be.eq(msg)
    expect(error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error!.httpStatusCode).to.be.eq(200)

    expect(authedRequest.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
