import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { POLONIEX_RAW_ORDERS } from '../../../test/fixtures/poloniexOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Poloniex raw orders just fine', async () => {

    // preparing data
    const mockedRawOrders = POLONIEX_RAW_ORDERS

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRawOrders))

    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { rawOrders } = await exchange.order.listRaw()


    // validating
    expect(rawOrders).to.deep.eq(mockedRawOrders)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getPoloniexEndpoints(exchange.settings).order.list,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
