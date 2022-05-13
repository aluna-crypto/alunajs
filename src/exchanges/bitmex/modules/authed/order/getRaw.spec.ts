import { expect } from 'chai'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { BITMEX_RAW_ORDERS } from '../../../test/fixtures/bitmexOrders'
import * as getMod from '../../public/market/get'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Bitmex raw order just fine', async () => {

    // preparing data
    const bitmexOrder = BITMEX_RAW_ORDERS[0]
    const market = PARSED_MARKETS[0]
    const {
      orderID,
      symbol,
    } = bitmexOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.resolve([bitmexOrder]))

    const { get } = mockGet({ module: getMod })
    get.returns({ market })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id: orderID,
      symbolPair: '',
    })


    // validating
    expect(rawOrder).to.deep.eq({
      bitmexOrder,
      market,
    })

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getBitmexEndpoints(exchange.settings).order.get,
      body: { filter: { orderID } },
    })

    expect(get.callCount).to.be.eq(1)
    expect(get.firstCall.args[0]).to.deep.eq({
      http: new BitmexHttp({}),
      symbolPair: symbol,
    })

    expect(publicRequest.callCount).to.be.eq(0)
  })

})
