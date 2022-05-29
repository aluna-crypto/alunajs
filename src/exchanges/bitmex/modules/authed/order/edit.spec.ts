import { expect } from 'chai'
import Sinon from 'sinon'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { testEditOrder } from '../../../../../../test/macros/testEditOrder'
import { IMethodToMock } from '../../../../../../test/macros/testPlaceOrder'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaHttpErrorCodes } from '../../../../../lib/errors/AlunaHttpErrorCodes'
import { IAlunaOrderEditParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { mockEnsureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported.mock'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
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
      methodPath: getMarketMod,
      methodResponse: getMarketSpy,
    },
    {
      methodName: 'translateAmountToOrderQty',
      methodPath: translateAmountToOrderQtyMod,
      methodResponse: { orderQty: mockedOrderQty },
    },
  ]



  testEditOrder({
    ExchangeAuthed: BitmexAuthed,
    HttpClass: BitmexHttp,
    parseImportPath: parseMod,
    mockedOrders: [BITMEX_RAW_ORDERS[0]],
    credentials,
    methodsToMock,
    settings: mockedSettings,
    validationCallback: (params) => {

      const {
        exchange,
        authedRequestStub,
        mockedMethodsDictionary,
        editParams,
      } = params

      const { settings } = exchange

      const {
        id,
        type,
        rate,
        amount,
        stopRate,
        limitRate,
        symbolPair,
      } = editParams

      const {
        get,
        translateAmountToOrderQty,
      } = mockedMethodsDictionary!


      const ordType = translateOrderTypeToBitmex({
        from: type,
      })

      let price: number | undefined
      let stopPx: number | undefined

      switch (ordType) {

        case BitmexOrderTypeEnum.STOP_MARKET:
          stopPx = stopRate
          break

        case BitmexOrderTypeEnum.STOP_LIMIT:
          stopPx = stopRate
          price = limitRate
          break

        // Limit order
        default:
          price = rate

      }

      const { orderAnnotation } = settings

      const body = {
        orderQty: mockedOrderQty,
        orderID: id,
        ...(price ? { price } : {}),
        ...(stopPx ? { stopPx } : {}),
        ...(orderAnnotation ? { text: orderAnnotation } : {}),
      }

      expect(authedRequestStub.firstCall.args[0]).to.deep.eq({
        url: getBitmexEndpoints(settings).order.edit,
        verb: AlunaHttpVerbEnum.PUT,
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
    'should throw error for insufficient funds when editing new bitmex order',
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

      const params: IAlunaOrderEditParams = {
        id: bitmexOrder.orderID,
        symbolPair: bitmexOrder.symbol,
        account: AlunaAccountEnum.SPOT,
        amount: 0.01,
        side: AlunaOrderSideEnum.BUY,
        type: AlunaOrderTypesEnum.LIMIT,
        rate: 0,
      }

      const {
        error,
      } = await executeAndCatch(() => exchange.order.edit(params))


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

  it('should throw error if edit order fails somehow', async () => {

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

    const params: IAlunaOrderEditParams = {
      id: bitmexOrder.orderID,
      symbolPair: bitmexOrder.symbol,
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      rate: 0,
    }

    const {
      error,
    } = await executeAndCatch(() => exchange.order.edit(params))


    // validating
    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(alunaError.code)
    expect(error?.message).to.be.eq(message)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(get.callCount).to.be.eq(1)

    expect(parse.callCount).to.be.eq(0)

  })

})
