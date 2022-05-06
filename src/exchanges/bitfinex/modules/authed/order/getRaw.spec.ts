import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { BITFINEX_RAW_ORDERS } from '../../../test/fixtures/bitfinexOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Bitfinex raw order just fine', async () => {

    // preparing data
    const mockedRawOrder = BITFINEX_RAW_ORDERS[0]


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.returns(Promise.resolve([mockedRawOrder]))


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const [
      id,
      _gid,
      _cid,
      symbolPair,
    ] = mockedRawOrder

    const { rawOrder } = await exchange.order.getRaw({
      id: id.toString(),
      symbolPair,
    })


    // validating
    expect(rawOrder).to.deep.eq(mockedRawOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: bitfinexEndpoints.order.get(symbolPair),
      body: { id: [id] },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
