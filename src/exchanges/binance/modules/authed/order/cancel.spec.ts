import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderCancelParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { BINANCE_RAW_ORDERS } from '../../../test/fixtures/binanceOrders'
import * as getMod from './get'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should cancel a Binance order just fine (SPOT)', async () => {

    // preparing data
    const mockedRawOrder = BINANCE_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const { orderId } = mockedRawOrder

    const params: IAlunaOrderCancelParams = {
      id: orderId.toString(),
      account: AlunaAccountEnum.SPOT,
      symbolPair: 'symbolPair',
    }

    const query = new URLSearchParams()
    query.append('orderId', params.id)
    query.append('symbol', params.symbolPair)


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })


    const { get } = mockGet({ module: getMod })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    get.returns(Promise.resolve({ order: mockedParsedOrder }))


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { order } = await exchange.order.cancel(params)


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)



    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.DELETE,
      credentials,
      url: getBinanceEndpoints(exchange.settings).order.spot,
      query,
      weight: 1,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should cancel a Binance order just fine (MARGIN)', async () => {

    // preparing data
    const mockedRawOrder = BINANCE_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const { orderId } = mockedRawOrder

    const params: IAlunaOrderCancelParams = {
      id: orderId.toString(),
      account: AlunaAccountEnum.MARGIN,
      symbolPair: 'symbolPair',
    }

    const query = new URLSearchParams()
    query.append('orderId', params.id)
    query.append('symbol', params.symbolPair)


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })


    const { get } = mockGet({ module: getMod })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    get.returns(Promise.resolve({ order: mockedParsedOrder }))


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { order } = await exchange.order.cancel(params)


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)



    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.DELETE,
      credentials,
      url: getBinanceEndpoints(exchange.settings).order.margin,
      query,
      weight: 10,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw an error when canceling a Binance order', async () => {

    // preparing data
    const params: IAlunaOrderCancelParams = {
      id: 'id',
      symbolPair: 'symbolPair',
      account: AlunaAccountEnum.SPOT,
    }

    const query = new URLSearchParams()
    query.append('orderId', params.id)
    query.append('symbol', params.symbolPair)


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })

    const error = new AlunaError({
      code: AlunaOrderErrorCodes.CANCEL_FAILED,
      message: 'Something went wrong, order not canceled',
      httpStatusCode: 401,
      metadata: {},
    })

    authedRequest.returns(Promise.reject(error))


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const {
      error: responseError,
    } = await executeAndCatch(() => exchange.order.cancel(params))


    // validating
    expect(responseError).to.deep.eq(error)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.DELETE,
      credentials,
      query,
      url: getBinanceEndpoints(exchange.settings).order.spot,
      weight: 1,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should ensure order account is required to cancel binance orders', async () => {

    // preparing data
    const params: IAlunaOrderCancelParams = {
      id: 'id',
      symbolPair: 'symbolPair',
    }


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })
    authedRequest.returns(Promise.reject())


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { error } = await executeAndCatch(() => exchange.order.cancel(params))


    // validating
    const msg = 'Order account is required to cancel Binance orders'

    expect(error!.code).to.deep.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error!.message).to.deep.eq(msg)
    expect(error!.httpStatusCode).to.deep.eq(400)

    expect(authedRequest.callCount).to.be.eq(0)
    expect(publicRequest.callCount).to.be.eq(0)

  })

})
