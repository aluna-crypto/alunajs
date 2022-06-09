import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { testPlaceOrder } from '../../../../../../test/macros/testPlaceOrder'
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
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { translateOrderSideToBitfinex } from '../../../enums/adapters/bitfinexOrderSideAdapter'
import { translateOrderTypeToBitfinex } from '../../../enums/adapters/bitfinexOrderTypeAdapter'
import { BitfinexOrderTypeEnum } from '../../../enums/BitfinexOrderTypeEnum'
import { BITFINEX_PLACE_ORDER_RESPONSE } from '../../../test/fixtures/bitfinexOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const commonOrderParams: IAlunaOrderPlaceParams = {
    account: AlunaAccountEnum.SPOT,
    amount: 10,
    side: AlunaOrderSideEnum.BUY,
    symbolPair: 'tBTCETH',
    type: AlunaOrderTypesEnum.LIMIT,
    rate: 5,
    stopRate: 10,
    limitRate: 15,
  }

  const placedMarketOrder = cloneDeep(BITFINEX_PLACE_ORDER_RESPONSE)
  placedMarketOrder[4][0][8] = BitfinexOrderTypeEnum.MARKET

  const placedLimitOrder = cloneDeep(BITFINEX_PLACE_ORDER_RESPONSE)
  placedMarketOrder[4][0][8] = BitfinexOrderTypeEnum.LIMIT

  const rawOrders = [
    placedMarketOrder,
    placedLimitOrder,
  ]


  testPlaceOrder({
    ExchangeAuthed: BitfinexAuthed,
    HttpClass: BitfinexHttp,
    parseModule: parseMod,
    rawOrders,
    credentials,
    validationCallback: (params) => {

      const {
        authedRequestStub: stub,
        exchange,
        placeParams,
      } = params

      const {
        type,
        side,
        amount,
        rate,
        limitRate,
        stopRate,
        account,
        symbolPair,
      } = placeParams

      const translatedOrderType = translateOrderTypeToBitfinex({
        from: type,
        account,
      })

      const translatedAmount = translateOrderSideToBitfinex({
        amount: Number(amount),
        side,
      })

      let price: undefined | string
      let priceAuxLimit: undefined | string

      switch (type) {

        case AlunaOrderTypesEnum.LIMIT:
          price = rate!.toString()
          break

        case AlunaOrderTypesEnum.STOP_MARKET:
          price = stopRate!.toString()
          break

        case AlunaOrderTypesEnum.STOP_LIMIT:
          price = stopRate!.toString()
          priceAuxLimit = limitRate!.toString()
          break

        default:

      }

      const { affiliateCode } = exchange.settings

      const body: Record<string, any> = {
        ...(price ? { price } : {}),
        ...(priceAuxLimit ? { price_aux_limit: priceAuxLimit } : {}),
        amount: translatedAmount,
        symbol: symbolPair,
        type: translatedOrderType,
      }

      if (affiliateCode) {
        body.aff_code = affiliateCode
      }

      expect(stub.firstCall.args[0]).to.deep.eq({
        url: getBitfinexEndpoints({}).order.place,
        body,
        credentials,
      })

    },
  })

  it('should throw error if order place request fails', async () => {

    // preparing data
    const mockedRequestResponse = cloneDeep(BITFINEX_PLACE_ORDER_RESPONSE)
    mockedRequestResponse[6] = 'ERROR'


    // mocking
    const {
      authedRequest,
      publicRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRequestResponse))

    const { validateParamsMock } = mockValidateParams()
    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

    const { parse } = mockParse({ module: parseMod })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.order.place(commonOrderParams))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error!.message).to.be.eq(mockedRequestResponse[7])
    expect(error!.httpStatusCode).to.be.eq(500)
    expect(error!.metadata).to.be.eq(mockedRequestResponse)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)
    expect(parse.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if balance is insuficient to place order', async () => {

    // preparing data
    const affiliateCode = 'affiliateCode'

    const message = 'not enough balance to place order for xxx'

    const throwedError = new AlunaError({
      code: AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE,
      message,
      httpStatusCode: 500,
    })


    // mocking
    const {
      authedRequest,
      publicRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.returns(Promise.reject(throwedError))

    const { validateParamsMock } = mockValidateParams()
    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

    const { parse } = mockParse({ module: parseMod })


    // executing
    const exchange = new BitfinexAuthed({
      credentials,
      settings: { affiliateCode },
    })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.order.place(commonOrderParams))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
    expect(error!.message).to.be.eq(message)
    expect(error!.httpStatusCode).to.be.eq(200)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(parse.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if order amount is invalid', async () => {

    // preparing data
    const affiliateCode = 'affiliateCode'

    const message1 = 'Invalid order: maximum size for BTCUSD is 2000'
    const message2 = 'amount: invalid'

    const throwedError = new AlunaError({
      code: AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE,
      message: message1,
      httpStatusCode: 500,
    })


    // mocking
    const {
      authedRequest,
      publicRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.returns(Promise.reject(throwedError))

    const { validateParamsMock } = mockValidateParams()
    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

    const { parse } = mockParse({ module: parseMod })


    // executing
    const exchange = new BitfinexAuthed({
      credentials,
      settings: { affiliateCode },
    })

    let res = await executeAndCatch(() => exchange.order.place(commonOrderParams))


    // validating
    expect(res.result).not.to.be.ok

    expect(res.error!.code).to.be.eq(AlunaOrderErrorCodes.INVALID_AMOUNT)
    expect(res.error!.message).to.be.eq(message1)
    expect(res.error!.httpStatusCode).to.be.eq(200)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(parse.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)


    // preparing data
    throwedError.message = message2


    // executing
    res = await executeAndCatch(() => exchange.order.place(commonOrderParams))


    // validating
    expect(res.result).not.to.be.ok

    expect(res.error!.code).to.be.eq(AlunaOrderErrorCodes.INVALID_AMOUNT)
    expect(res.error!.message).to.be.eq(message2)
    expect(res.error!.httpStatusCode).to.be.eq(200)

    expect(validateParamsMock.callCount).to.be.eq(2)
    expect(ensureOrderIsSupported.callCount).to.be.eq(2)

    expect(parse.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
