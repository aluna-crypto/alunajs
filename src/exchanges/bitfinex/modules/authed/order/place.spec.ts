import { expect } from 'chai'
import { cloneDeep } from 'lodash'

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
import { BITFINEX_PLACE_ORDER_RESPONSE } from '../../../test/fixtures/bitfinexOrders'
import * as parseMod from './parse'
import { testBitfinexOrderPlace } from './test/testBitfinexOrderPlace'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const commonOrderParams: IAlunaOrderPlaceParams = {
    account: AlunaAccountEnum.EXCHANGE,
    amount: 10,
    side: AlunaOrderSideEnum.BUY,
    symbolPair: 'tBTCETH',
    type: AlunaOrderTypesEnum.LIMIT,
    rate: 10,
  }

  // EXCHANGE LIMIT Buy Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.EXCHANGE,
    type: AlunaOrderTypesEnum.LIMIT,
    amount: 10,
  })


  // EXCHANGE LIMIT Sell Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.EXCHANGE,
    type: AlunaOrderTypesEnum.LIMIT,
    amount: -10,
  })


  // EXCHANGE MARKET Buy Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.EXCHANGE,
    type: AlunaOrderTypesEnum.MARKET,
    amount: 10,
    rate: undefined,
  })


  // EXCHANGE MARKET Sell Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.EXCHANGE,
    type: AlunaOrderTypesEnum.MARKET,
    amount: -10,
    rate: undefined,
  })


  // EXCHANGE STOP_MARKET Buy Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.EXCHANGE,
    type: AlunaOrderTypesEnum.STOP_MARKET,
    amount: 10,
    stopRate: 5,
  })


  // EXCHANGE STOP_MARKET Sell Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.EXCHANGE,
    type: AlunaOrderTypesEnum.STOP_MARKET,
    amount: -10,
    stopRate: 5,
  })


  // EXCHANGE STOP_LIMIT Buy Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.EXCHANGE,
    type: AlunaOrderTypesEnum.STOP_LIMIT,
    amount: 10,
    stopRate: 5,
    limitRate: 8,
  })


  // EXCHANGE STOP_LIMIT Sell Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.EXCHANGE,
    type: AlunaOrderTypesEnum.STOP_LIMIT,
    amount: -10,
    stopRate: 5,
    limitRate: 8,
  })


  // MARGIN LIMIT Buy Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.MARGIN,
    type: AlunaOrderTypesEnum.LIMIT,
    amount: 10,
  })


  // MARGIN LIMIT Sell Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.MARGIN,
    type: AlunaOrderTypesEnum.LIMIT,
    amount: -10,
  })


  // MARGIN MARKET Buy Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.MARGIN,
    type: AlunaOrderTypesEnum.MARKET,
    amount: 10,
    rate: undefined,
  })


  // MARGIN MARKET Sell Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.MARGIN,
    type: AlunaOrderTypesEnum.MARKET,
    amount: -10,
    rate: undefined,
  })


  // MARGIN STOP_MARKET Buy Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.MARGIN,
    type: AlunaOrderTypesEnum.STOP_MARKET,
    amount: 10,
    stopRate: 5,
  })


  // MARGIN STOP_MARKET Sell Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.MARGIN,
    type: AlunaOrderTypesEnum.STOP_MARKET,
    amount: -10,
    stopRate: 5,
  })


  // MARGIN STOP_LIMIT Buy Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.MARGIN,
    type: AlunaOrderTypesEnum.STOP_LIMIT,
    amount: 10,
    stopRate: 5,
    limitRate: 8,
  })


  // MARGIN STOP_LIMIT Sell Order
  testBitfinexOrderPlace({
    ...commonOrderParams,
    account: AlunaAccountEnum.MARGIN,
    type: AlunaOrderTypesEnum.STOP_LIMIT,
    amount: -10,
    stopRate: 5,
    limitRate: 8,
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
      httpStatusCode: 400,
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

    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
    expect(error!.message).to.be.eq(message)
    expect(error!.httpStatusCode).to.be.eq(400)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(parse.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
