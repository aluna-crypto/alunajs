import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../../test/mocks/exchange/Http'
import { mockParse } from '../../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaOrderPlaceParams } from '../../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockEnsureOrderIsSupported } from '../../../../../../utils/orders/ensureOrderIsSupported.mock'
import { placeOrderParamsSchema } from '../../../../../../utils/validation/schemas/placeOrderParamsSchema'
import { mockValidateParams } from '../../../../../../utils/validation/validateParams.mock'
import { BitfinexAuthed } from '../../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../../bitfinexSpecs'
import { BITFINEX_PLACE_ORDER_RESPONSE } from '../../../../test/fixtures/bitfinexOrders'
import * as parseMod from '../parse'
import { getExpectedRequestBody } from './helpers/getExpectedRequestBody'



const credentials: IAlunaCredentialsSchema = {
  key: 'key',
  secret: 'secret',
}



export const testBitfinexOrderPlace = (params: IAlunaOrderPlaceParams) => {

  const {
    account,
    type,
    side,
  } = params


  it(`should place a Bitfinex ${side} ${account} ${type} order just fine`, async () => {

    // preparing data
    const mockedParsedOrder = PARSED_ORDERS[0]
    const mockedRequestResponse = BITFINEX_PLACE_ORDER_RESPONSE


    // mocking
    const {
      authedRequest,
      publicRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRequestResponse))

    const { validateParamsMock } = mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: mockedParsedOrder })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { order } = await exchange.order.place(params)


    // validating
    const body = getExpectedRequestBody(params)

    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      url: getBitfinexEndpoints(exchange.settings).order.place,
      credentials,
      body,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(parse.callCount).to.be.eq(1)
    expect(parse.firstCall.args[0]).to.deep.eq({
      rawOrder: mockedRequestResponse[4][0],
    })

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(validateParamsMock.firstCall.args[0]).to.deep.eq({
      params,
      schema: placeOrderParamsSchema,
    })

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.firstCall.args[0]).to.deep.eq({
      exchangeSpecs: exchange.specs,
      orderPlaceParams: params,
    })

  })

}
