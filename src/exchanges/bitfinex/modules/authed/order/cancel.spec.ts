import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import {
  BITFINEX_CANCEL_ORDER_RESPONSE,
  BITFINEX_RAW_ORDERS,
} from '../../../test/fixtures/bitfinexOrders'
import * as getMod from './get'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should cancel a Bitfinex order just fine', async () => {

    // preparing data
    const mockedRawOrder = BITFINEX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]
    const mockedRequestResponse = BITFINEX_CANCEL_ORDER_RESPONSE


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })
    authedRequest.returns(Promise.resolve(mockedRequestResponse))

    const { get } = mockGet({ module: getMod })
    get.returns({ order: mockedParsedOrder })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const [
      id,
      _gid,
      _cid,
      symbolPair,
    ] = mockedRawOrder

    const { order } = await exchange.order.cancel({
      id: id.toString(),
      symbolPair,
    })


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: bitfinexEndpoints.order.cancel,
      body: { id },
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(get.callCount).to.be.eq(1)
    expect(get.firstCall.args[0]).to.deep.eq({
      id: id.toString(),
      symbolPair,
      http: new BitfinexHttp({}),
    })

  })

  it('should throw an error if cancel request does not succeeds', async () => {

    // preparing data
    const mockedRawOrder = BITFINEX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]
    const mockedRequestResponse = cloneDeep(BITFINEX_CANCEL_ORDER_RESPONSE)
    mockedRequestResponse[6] = 'ERROR'


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })
    authedRequest.returns(Promise.resolve(mockedRequestResponse))

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: mockedParsedOrder })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const [
      id,
      _gid,
      _cid,
      symbolPair,
    ] = mockedRawOrder

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.order.cancel({
      id: id.toString(),
      symbolPair,
    }))


    // validating

    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaOrderErrorCodes.CANCEL_FAILED)
    expect(error!.message).to.be.eq(mockedRequestResponse[7])
    expect(error!.httpStatusCode).to.be.eq(500)
    expect(error!.metadata).to.be.eq(mockedRequestResponse)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: bitfinexEndpoints.order.cancel,
      body: { id },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
