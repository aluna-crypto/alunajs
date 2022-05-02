import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BittrexAuthed } from '../../../BittrexAuthed'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import { BITTREX_RAW_ORDERS } from '../../../test/fixtures/bittrexOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Bittrex raw order just fine', async () => {

    // preparing data
    const http = new BittrexHttp()

    const mockedRawOrder = BITTREX_RAW_ORDERS[0]

    const { id } = mockedRawOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRawOrder))


    // executing
    const exchange = new BittrexAuthed({ credentials })

    const {
      rawOrder,
      requestCount,
    } = await exchange.order.getRaw({
      id,
      symbolPair: '',
    })


    // validating
    expect(rawOrder).to.deep.eq(mockedRawOrder)

    expect(requestCount).to.deep.eq(http.requestCount)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: `${BITTREX_PRODUCTION_URL}/orders/${id}`,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
