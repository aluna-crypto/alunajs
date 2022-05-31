import { expect } from 'chai'
import Sinon from 'sinon'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import {
  IMethodToMock,
  testPlaceOrder,
} from '../../../../../../test/macros/testPlaceOrder'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { mockEnsureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported.mock'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { translateOrderSideToFtx } from '../../../enums/adapters/ftxOrderSideAdapter'
import { translateOrderTypeToFtx } from '../../../enums/adapters/ftxOrderTypeAdapter'
import { FtxAuthed } from '../../../FtxAuthed'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { FTX_RAW_ORDERS } from '../../../test/fixtures/ftxOrders'
import * as getMod from './get'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const order = PARSED_ORDERS[0]
  const rawOrders = [FTX_RAW_ORDERS[0]]

  const getOrderSpy = Sinon.spy(
    async () => Promise.resolve({ order }),
  )


  const methodsToMock: IMethodToMock[] = [
    {
      methodModule: getMod,
      methodName: 'get',
      methodResponse: getOrderSpy,
    },
  ]

  testPlaceOrder({
    ExchangeAuthed: FtxAuthed,
    HttpClass: FtxHttp,
    parseModule: parseMod,
    rawOrders,
    credentials,
    methodsToMock,
    validationCallback: (params) => {

      const {
        exchange,
        authedRequestStub,
        placeParams,
        mockedMethodsDictionary,
      } = params

      const { settings } = exchange

      const {
        type,
        amount,
        rate,
        limitRate,
        stopRate,
        symbolPair,
        side,
        reduceOnly,
      } = placeParams


      const {
        get,
      } = mockedMethodsDictionary!

      const translatedOrderSide = translateOrderSideToFtx({
        from: side,
      })

      const translatedOrderType = translateOrderTypeToFtx({
        from: type,
      })

      const body: Record<string, any> = {
        side: translatedOrderSide,
        market: symbolPair,
        size: amount,
        type: translatedOrderType,
        ...(reduceOnly ? { reduceOnly } : {}),
      }

      let url: string

      switch (type) {

        case AlunaOrderTypesEnum.LIMIT:
          url = getFtxEndpoints(settings).order.place
          body.price = rate
          break

        case AlunaOrderTypesEnum.STOP_MARKET:
          url = getFtxEndpoints(settings).order.placeTriggerOrder
          body.triggerPrice = stopRate
          break

        case AlunaOrderTypesEnum.STOP_LIMIT:
          url = getFtxEndpoints(settings).order.placeTriggerOrder
          body.triggerPrice = stopRate
          body.orderPrice = limitRate
          break

        // Market orders
        default:
          url = getFtxEndpoints(settings).order.place
          body.price = null

      }

      expect(authedRequestStub.callCount).to.be.eq(1)
      expect(authedRequestStub.firstCall.args[0]).to.deep.eq({
        url,
        credentials,
        body,
      })

      expect(get.callCount).to.be.eq(1)

      expect(getOrderSpy.callCount).to.be.eq(1)
      expect(getOrderSpy.firstCall.args).to.deep.eq([{
        id: rawOrders[0].id.toString(),
        symbolPair,
        http: new FtxHttp(settings),
      }])

      getOrderSpy.resetHistory()

    },
  })

  it(
    'should throw error for insufficient funds when placing new ftx order',
    async () => {

      // preparing data
      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET

      const expectedMessage = 'Account has insufficient balance '
        .concat('for requested action.')
      const expectedCode = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      const alunaError = new AlunaError({
        message: 'Not enough balances',
        code: AlunaOrderErrorCodes.PLACE_FAILED,
        httpStatusCode: 401,
        metadata: {},
      })

      const params = {
        symbolPair: '',
        account: AlunaAccountEnum.SPOT,
        amount: 0.01,
        side,
        type,
        rate: 0,
      }

      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: FtxHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      const { get } = mockGet({ module: getMod })

      const { validateParamsMock } = mockValidateParams()

      const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


      // executing
      const exchange = new FtxAuthed({ credentials })

      const { error } = await executeAndCatch(
        () => exchange.order.place(params),
      )


      // validating
      expect(error instanceof AlunaError).to.be.ok
      expect(error?.code).to.be.eq(expectedCode)
      expect(error?.message).to.be.eq(expectedMessage)

      expect(authedRequest.callCount).to.be.eq(1)

      expect(publicRequest.callCount).to.be.eq(0)

      expect(ensureOrderIsSupported.callCount).to.be.eq(1)

      expect(validateParamsMock.callCount).to.be.eq(1)

      expect(get.callCount).to.be.eq(0)

    },
  )

  it('should throw an error placing new ftx order', async () => {

    // preparing data
    // const mockedRawOrder = FTX_RAW_ORDERS[0]

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

    const params = {
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
      side,
      type,
      rate: Number(0),
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })
    authedRequest.returns(Promise.reject(alunaError))

    const { get } = mockGet({ module: getMod })

    const { validateParamsMock } = mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new FtxAuthed({ credentials })

    const { error } = await executeAndCatch(
      () => exchange.order.place(params),
    )

    // validating
    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(expectedCode)
    expect(error?.message).to.be.eq(expectedMessage)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(validateParamsMock.callCount).to.be.eq(1)

    expect(get.callCount).to.be.eq(0)

  })

})
