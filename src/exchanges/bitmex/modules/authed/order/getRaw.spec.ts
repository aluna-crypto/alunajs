import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { BITMEX_RAW_ORDERS } from '../../../test/fixtures/bitmexOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Bitmex raw order just fine', async () => {

    // preparing data
    const mockedRawOrder = BITMEX_RAW_ORDERS[0]

    const { id } = mockedRawOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRawOrder))


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair: '',
    })


    // validating
    expect(rawOrder).to.deep.eq(mockedRawOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getBitmexEndpoints(exchange.settings).order.get(id),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
