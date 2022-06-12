import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { BITFINEX_CANCEL_ORDER_RESPONSE } from '../../../test/fixtures/bitfinexOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should cancel a Bitfinex order just fine', async () => {

    // preparing data
    const parsedOrder = PARSED_ORDERS[0]
    const requestResponse = cloneDeep(BITFINEX_CANCEL_ORDER_RESPONSE)
    const rawOrder = requestResponse[4]

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })
    authedRequest.returns(Promise.resolve(requestResponse))

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: parsedOrder })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const [
      id,
      _gid,
      _cid,
      symbolPair,
    ] = rawOrder

    const { order } = await exchange.order.cancel({
      id: id.toString(),
      symbolPair,
      type: AlunaOrderTypesEnum.LIMIT,
    })


    // validating
    expect(order).to.deep.eq(parsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitfinexEndpoints(exchange.settings).order.cancel,
      body: { id },
    })

    expect(publicRequest.callCount).to.be.eq(0)

    rawOrder[13] = 'CANCELED'

    expect(parse.callCount).to.be.eq(1)
    expect(parse.firstCall.args[0]).to.deep.eq({
      rawOrder,
    })

  })

  it('should throw an error if cancel request does not succeeds', async () => {

    // preparing data
    const parsedOrder = PARSED_ORDERS[0]
    const requestResponse = cloneDeep(BITFINEX_CANCEL_ORDER_RESPONSE)
    const rawOrder = requestResponse[4]
    requestResponse[6] = 'ERROR'


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })
    authedRequest.returns(Promise.resolve(requestResponse))

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: parsedOrder })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const [
      id,
      _gid,
      _cid,
      symbolPair,
    ] = rawOrder

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.order.cancel({
      id: id.toString(),
      symbolPair,
      type: AlunaOrderTypesEnum.LIMIT,
    }))


    // validating

    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaOrderErrorCodes.CANCEL_FAILED)
    expect(error!.message).to.be.eq(requestResponse[7])
    expect(error!.httpStatusCode).to.be.eq(500)
    expect(error!.metadata).to.be.eq(requestResponse)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitfinexEndpoints(exchange.settings).order.cancel,
      body: { id },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
