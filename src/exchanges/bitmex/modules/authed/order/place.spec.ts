import { expect } from 'chai'
import Sinon from 'sinon'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import {
  IMethodToMock,
  testPlaceOrder,
} from '../../../../../../test/macros/testPlaceOrder'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaHttpErrorCodes } from '../../../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderPlaceParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { mockEnsureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported.mock'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { translateOrderSideToBitmex } from '../../../enums/adapters/bitmexOrderSideAdapter'
import { translateOrderTypeToBitmex } from '../../../enums/adapters/bitmexOrderTypeAdapter'
import { BitmexOrderTypeEnum } from '../../../enums/BitmexOrderTypeEnum'
import { BITMEX_RAW_ORDERS } from '../../../test/fixtures/bitmexOrders'
import * as getMarketMod from '../../public/market/get'
import * as translateAmountToOrderQtyMod from './helpers/translateAmountToOrderQty'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const mockedOrderQty = 10
  const mockedMarket = PARSED_MARKETS[0]
  const mockedSettings = { orderAnnotation: 'sentByAlunajs' }
  const getMarketSpy = Sinon.spy(
    async () => Promise.resolve({ market: mockedMarket }),
  )

  const methodsToMock: IMethodToMock[] = [
    {
      methodName: 'get',
      methodModule: getMarketMod,
      methodResponse: getMarketSpy,
    },
    {
      methodName: 'translateAmountToOrderQty',
      methodModule: translateAmountToOrderQtyMod,
      methodResponse: { orderQty: mockedOrderQty },
    },
  ]

  testPlaceOrder({
    ExchangeAuthed: BitmexAuthed,
    HttpClass: BitmexHttp,
    parseModule: parseMod,
    rawOrders: [BITMEX_RAW_ORDERS[0]],
    credentials,
    methodsToMock,
    settings: mockedSettings,
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
      } = placeParams

      const {
        get,
        translateAmountToOrderQty,
      } = mockedMethodsDictionary!


      const ordType = translateOrderTypeToBitmex({
        from: type,
      })

      const translatedSide = translateOrderSideToBitmex({
        from: side,
      })


      let price: number | undefined
      let stopPx: number | undefined

      switch (ordType) {

        case BitmexOrderTypeEnum.LIMIT:
          price = rate
          break

        case BitmexOrderTypeEnum.STOP_MARKET:
          stopPx = stopRate
          break

        case BitmexOrderTypeEnum.STOP_LIMIT:
          stopPx = stopRate
          price = limitRate
          break

        // For market orders no prop is needed
        default:

      }

      const { orderAnnotation } = settings

      const body = {
        orderQty: mockedOrderQty,
        symbol: symbolPair,
        side: translatedSide,
        ordType,
        ...(price ? { price } : {}),
        ...(stopPx ? { stopPx } : {}),
        ...(orderAnnotation ? { text: orderAnnotation } : {}),
      }

      expect(authedRequestStub.firstCall.args[0]).to.deep.eq({
        url: getBitmexEndpoints(settings).order.place,
        body,
        credentials,
      })

      expect(get.callCount).to.be.eq(1)
      expect(getMarketSpy.callCount).to.be.eq(1)
      expect(getMarketSpy.firstCall.args).to.deep.eq([{
        symbolPair,
        http: new BitmexHttp(settings),
      }])

      expect(translateAmountToOrderQty.callCount).to.be.eq(1)
      expect(translateAmountToOrderQty.firstCall.args[0]).to.deep.eq({
        amount,
        instrument: mockedMarket.instrument!,
      })

      getMarketSpy.resetHistory()

    },
  })

  it(
    'should throw error for insufficient funds when placing new bitmex order',
    async () => {

      // preparing data
      const bitmexOrder = BITMEX_RAW_ORDERS[0]
      const market = PARSED_MARKETS[0]

      const message = 'Account has insufficient Available Balance'

      const alunaError = new AlunaError({
        message,
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        httpStatusCode: 400,
      })


      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: BitmexHttp.prototype })
      authedRequest.returns(Promise.reject(alunaError))

      const { get } = mockGet({ module: getMarketMod })
      get.returns(Promise.resolve({ market }))

      const { parse } = mockParse({ module: parseMod })

      const { validateParamsMock } = mockValidateParams()
      const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


      // executing
      const exchange = new BitmexAuthed({ credentials })

      const params: IAlunaOrderPlaceParams = {
        symbolPair: bitmexOrder.symbol,
        account: AlunaAccountEnum.SPOT,
        amount: 0.01,
        side: AlunaOrderSideEnum.BUY,
        type: AlunaOrderTypesEnum.LIMIT,
        rate: 0,
      }

      const {
        error,
      } = await executeAndCatch(() => exchange.order.place(params))


      // validating
      expect(error instanceof AlunaError).to.be.ok
      expect(error?.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
      expect(error?.message).to.be.eq(message)

      expect(authedRequest.callCount).to.be.eq(1)

      expect(publicRequest.callCount).to.be.eq(0)

      expect(validateParamsMock.callCount).to.be.eq(1)
      expect(ensureOrderIsSupported.callCount).to.be.eq(1)

      expect(get.callCount).to.be.eq(1)

      expect(parse.callCount).to.be.eq(0)

    },
  )

  it('should throw error if order price is invalid', async () => {

    // preparing data
    const bitmexOrder = BITMEX_RAW_ORDERS[0]
    const market = PARSED_MARKETS[0]

    const message = 'Invalid price'

    const alunaError = new AlunaError({
      message,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      httpStatusCode: 400,
    })


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })
    authedRequest.returns(Promise.reject(alunaError))

    const { get } = mockGet({ module: getMarketMod })
    get.returns(Promise.resolve({ market }))

    const { parse } = mockParse({ module: parseMod })

    const { validateParamsMock } = mockValidateParams()
    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: bitmexOrder.symbol,
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      rate: 0,
    }

    const {
      error,
    } = await executeAndCatch(() => exchange.order.place(params))


    // validating
    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(AlunaOrderErrorCodes.INVALID_PRICE)
    expect(error?.message).to.be.eq(message)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(get.callCount).to.be.eq(1)

    expect(parse.callCount).to.be.eq(0)

  })

  it('should throw error if order amount is invalid', async () => {

    // preparing data
    const bitmexOrder = BITMEX_RAW_ORDERS[0]
    const market = PARSED_MARKETS[0]

    const message1 = 'Invalid leavesQty for lotSize'
    const message2 = 'Invalid orderQty'
    const message3 = 'Invalid order: minimum sie for ADAUSD is 4'

    const alunaError = new AlunaError({
      message: message1,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      httpStatusCode: 400,
    })


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })
    authedRequest.returns(Promise.reject(alunaError))

    const { get } = mockGet({ module: getMarketMod })
    get.returns(Promise.resolve({ market }))

    const { parse } = mockParse({ module: parseMod })

    const { validateParamsMock } = mockValidateParams()
    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: bitmexOrder.symbol,
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      rate: 0,
    }

    let res = await executeAndCatch(() => exchange.order.place(params))


    // validating
    expect(res.error instanceof AlunaError).to.be.ok
    expect(res.error?.code).to.be.eq(AlunaOrderErrorCodes.INVALID_AMOUNT)
    expect(res.error?.message).to.be.eq(message1)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(get.callCount).to.be.eq(1)

    expect(parse.callCount).to.be.eq(0)


    // preparing data
    alunaError.message = message2


    // executing
    res = await executeAndCatch(() => exchange.order.place(params))


    // validating
    expect(res.error instanceof AlunaError).to.be.ok
    expect(res.error?.code).to.be.eq(AlunaOrderErrorCodes.INVALID_AMOUNT)
    expect(res.error?.message).to.be.eq(message2)

    expect(authedRequest.callCount).to.be.eq(2)

    expect(publicRequest.callCount).to.be.eq(0)

    expect(validateParamsMock.callCount).to.be.eq(2)
    expect(ensureOrderIsSupported.callCount).to.be.eq(2)

    expect(get.callCount).to.be.eq(2)

    expect(parse.callCount).to.be.eq(0)



    // preparing data
    alunaError.message = message3


    // executing
    res = await executeAndCatch(() => exchange.order.place(params))


    // validating
    expect(res.error instanceof AlunaError).to.be.ok
    expect(res.error?.code).to.be.eq(AlunaOrderErrorCodes.INVALID_AMOUNT)
    expect(res.error?.message).to.be.eq(message3)

    expect(authedRequest.callCount).to.be.eq(2)

    expect(publicRequest.callCount).to.be.eq(0)

    expect(validateParamsMock.callCount).to.be.eq(2)
    expect(ensureOrderIsSupported.callCount).to.be.eq(2)

    expect(get.callCount).to.be.eq(2)

    expect(parse.callCount).to.be.eq(0)

  })

  it('should throw error if place order fails somehow', async () => {

    // preparing data
    const bitmexOrder = BITMEX_RAW_ORDERS[0]
    const market = PARSED_MARKETS[0]

    const message = 'unknown error'

    const alunaError = new AlunaError({
      message,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      httpStatusCode: 400,
    })


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.reject(alunaError))

    const { get } = mockGet({ module: getMarketMod })
    get.returns(Promise.resolve({ market }))

    const { parse } = mockParse({ module: parseMod })

    const { validateParamsMock } = mockValidateParams()
    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: bitmexOrder.symbol,
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      rate: 0,
    }

    const {
      error,
    } = await executeAndCatch(() => exchange.order.place(params))


    // validating
    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error?.message).to.be.eq(message)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(get.callCount).to.be.eq(1)

    expect(parse.callCount).to.be.eq(0)

  })

})
