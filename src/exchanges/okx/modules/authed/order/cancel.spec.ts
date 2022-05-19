import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaError } from '../../../../../lib/core/AlunaError'
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

  it('should throw an error when canceling a Okx order', async () => {

    // preparing data
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

    authedRequest.returns(Promise.reject(error))


    // executing
    const exchange = new OkxAuthed({ credentials })

    const { error: responseError } = await executeAndCatch(
      () => exchange.order.cancel({
        id,
        symbolPair,
      }),
    )


    // validating
    expect(responseError).to.deep.eq(error)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getOkxEndpoints(exchange.settings).order.cancel,
      body,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
