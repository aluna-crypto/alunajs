import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { OkxAuthed } from '../../../OkxAuthed'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { OKX_RAW_ORDERS } from '../../../test/fixtures/okxOrders'
import * as getMod from './get'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should cancel a Okx order just fine', async () => {

    // preparing data
    const mockedRawOrder = OKX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const { ordId: id } = mockedRawOrder

    const body = {
      ordId: id,
      instId: '',
    }


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    const { get } = mockGet({ module: getMod })

    get.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))


    // executing
    const exchange = new OkxAuthed({ credentials })

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
      url: getOkxEndpoints(exchange.settings).order.cancel,
      body,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should cancel a Okx stop order just fine', async () => {

    // preparing data
    const mockedRawOrder = OKX_RAW_ORDERS[0]
    const mockedParsedOrder = cloneDeep(PARSED_ORDERS[0])

    mockedParsedOrder.type = AlunaOrderTypesEnum.STOP_LIMIT

    const { ordId: id } = mockedRawOrder

    const body = [
      {
        algoId: id,
        instId: '',
      },
    ]


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    const { get } = mockGet({ module: getMod })

    get.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))


    // executing
    const exchange = new OkxAuthed({ credentials })

    const { order } = await exchange.order.cancel({
      id,
      symbolPair: '',
      type: AlunaOrderTypesEnum.STOP_LIMIT,
    })


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getOkxEndpoints(exchange.settings).order.cancelStop,
      body,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw an error when canceling a Okx order', async () => {

    // preparing data

    const mockedOrder = cloneDeep(OKX_RAW_ORDERS[0])

    const id = 'id'
    const symbolPair = 'symbolPair'

    const body = {
      ordId: id,
      instId: symbolPair,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    const error = new AlunaError({
      code: AlunaOrderErrorCodes.CANCEL_FAILED,
      message: 'Something went wrong, order not canceled',
      httpStatusCode: 401,
      metadata: {},
    })

    const { get } = mockGet({ module: getMod })

    get.returns({ order: mockedOrder })

    authedRequest.returns(Promise.reject(error))

    // executing
    const exchange = new OkxAuthed({ credentials })

    const { error: responseError } = await executeAndCatch(
      () => exchange.order.cancel({
        id,
        symbolPair,
        type: AlunaOrderTypesEnum.LIMIT,
      }),
    )


    // validating
    expect(responseError).to.deep.eq(error)

    expect(get.callCount).to.be.eq(0)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getOkxEndpoints(exchange.settings).order.cancel,
      body,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
