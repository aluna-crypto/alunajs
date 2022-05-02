import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockOrderParse } from '../../../../../../test/mocks/exchange/modules/order/mockOrderParse'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BittrexAuthed } from '../../../BittrexAuthed'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import { BITTREX_PARSED_ORDERS, BITTREX_RAW_ORDERS } from '../../../test/fixtures/bittrexOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should cancel a Bittrex order just fine', async () => {

    // preparing data
    const http = new BittrexHttp()

    const mockedRawOrder = BITTREX_RAW_ORDERS[0]
    const mockedParsedOrder = BITTREX_PARSED_ORDERS[0]

    const { id, marketSymbol } = mockedRawOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    const { parse } = mockOrderParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))


    // executing
    const exchange = new BittrexAuthed({ credentials })

    const {
      order,
      requestCount,
    } = await exchange.order.cancel({
      id,
      symbolPair: marketSymbol,
    })


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(requestCount).to.deep.eq(http.requestCount)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.DELETE,
      credentials,
      url: `${BITTREX_PRODUCTION_URL}/orders/${id}`,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw an error when canceling a Bittrex order', async () => {

    // preparing data
    const http = new BittrexHttp()


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    const error = new AlunaError({
      code: AlunaOrderErrorCodes.CANCEL_FAILED,
      message: 'Something went wrong, order not canceled',
      httpStatusCode: 401,
      metadata: {},
    })

    authedRequest.returns(Promise.reject(error))


    // executing
    const exchange = new BittrexAuthed({ credentials })

    const { error: responseError } = await executeAndCatch(
      () => exchange.order.cancel({
        id: 'id',
        symbolPair: 'symbolPair',
      }),
    )


    // validating
    expect(responseError).to.deep.eq(error)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.DELETE,
      credentials,
      url: `${BITTREX_PRODUCTION_URL}/orders/id`,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
