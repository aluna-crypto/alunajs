import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../../test/mocks/exchange/Http'
import { mockParse } from '../../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaOrderEditParams } from '../../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../../lib/schemas/IAlunaCredentialsSchema'
import { editOrderParamsSchema } from '../../../../../../utils/validation/schemas/editOrderParamsSchema'
import { mockValidateParams } from '../../../../../../utils/validation/validateParams.mock'
import { BitfinexAuthed } from '../../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../../bitfinexSpecs'
import { BITFINEX_CANCEL_ORDER_RESPONSE } from '../../../../test/fixtures/bitfinexOrders'
import * as parseMod from '../parse'
import { getExpectedRequestBody } from './helpers/getExpectedRequestBody'



const credentials: IAlunaCredentialsSchema = {
  key: 'key',
  secret: 'secret',
}



export const testBitfinexOrderEdit = (params: IAlunaOrderEditParams) => {

  const {
    account,
    type,
    side,
  } = params


  it(`should edit a Bitfinex ${side} ${account} ${type} order just fine`, async () => {

    // preparing data
    const mockedParsedOrder = PARSED_ORDERS[0]
    const mockedRequestResponse = BITFINEX_CANCEL_ORDER_RESPONSE


    // mocking
    const {
      authedRequest,
      publicRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRequestResponse))

    const { validateParamsMock } = mockValidateParams()

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: mockedParsedOrder })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { order } = await exchange.order.edit(params)


    // validating
    const body = getExpectedRequestBody(params)

    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      url: getBitfinexEndpoints(exchange.settings).order.edit,
      credentials,
      body,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(parse.callCount).to.be.eq(1)
    expect(parse.firstCall.args[0]).to.deep.eq({
      rawOrder: mockedRequestResponse[4],
    })

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(validateParamsMock.firstCall.args[0]).to.deep.eq({
      params,
      schema: editOrderParamsSchema,
    })

  })

}
