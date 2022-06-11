import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { HUOBI_RAW_ORDERS } from '../../../test/fixtures/huobiOrders'
import * as getMod from './get'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should cancel a Huobi order just fine', async () => {

    // preparing data
    const mockedRawOrder = HUOBI_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const { id: rawId } = mockedRawOrder

    const id = rawId.toString()

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    const { get } = mockGet({ module: getMod })

    get.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(rawId))


    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { order } = await exchange.order.cancel({
      id,
      symbolPair: '',
      type: AlunaOrderTypesEnum.LIMIT,
    })


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getHuobiEndpoints(exchange.settings).order.cancel(id),
      body: undefined,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should cancel a Huobi stop limit order just fine', async () => {

    // preparing data
    const mockedRawOrder = HUOBI_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const { id: rawId } = mockedRawOrder

    const id = rawId.toString()

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    const { get } = mockGet({ module: getMod })

    get.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(rawId))


    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { order } = await exchange.order.cancel({
      id,
      symbolPair: '',
      clientOrderId: id,
      type: AlunaOrderTypesEnum.STOP_LIMIT,
    })


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getHuobiEndpoints(exchange.settings).order.cancelStop,
      body: {
        clientOrderIds: [id],
      },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw an error when canceling a Huobi order', async () => {

    // preparing data
    const id = 'id'

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    const error = new AlunaError({
      code: AlunaOrderErrorCodes.CANCEL_FAILED,
      message: 'Something went wrong, order not canceled',
      httpStatusCode: 401,
      metadata: {},
    })

    authedRequest.returns(Promise.reject(error))


    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { error: responseError } = await executeAndCatch(
      () => exchange.order.cancel({
        id,
        symbolPair: 'symbolPair',
        type: AlunaOrderTypesEnum.LIMIT,
      }),
    )


    // validating
    expect(responseError).to.deep.eq(error)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getHuobiEndpoints(exchange.settings).order.cancel(id),
      body: undefined,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw an error when clientOrderId is not provided on stop orders', async () => {

    // preparing data
    const mockedRawOrder = HUOBI_RAW_ORDERS[0]

    const { id: rawId } = mockedRawOrder

    const id = rawId.toString()

    const params = {
      id,
      symbolPair: '',
      type: AlunaOrderTypesEnum.STOP_MARKET,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    authedRequest.returns(Promise.resolve(rawId))

    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { error } = await executeAndCatch(() => exchange.order.cancel(params))

    // validating
    expect(error).to.deep.eq(new AlunaError({
      httpStatusCode: 200,
      message: "param 'clientOrderId' is required for conditional orders",
      code: AlunaGenericErrorCodes.PARAM_ERROR,
      metadata: params,
    }))

    expect(authedRequest.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
