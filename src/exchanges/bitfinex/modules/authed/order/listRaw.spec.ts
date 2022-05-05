import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
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

  it('should list Bitfinex raw orders just fine', async () => {

    // preparing data
    const mockedRawOrders = BITFINEX_RAW_ORDERS

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRawOrders))

    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { rawOrders } = await exchange.order.listRaw()


    // validating
    expect(rawOrders).to.deep.eq(mockedRawOrders)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: bitfinexEndpoints.order.list,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
