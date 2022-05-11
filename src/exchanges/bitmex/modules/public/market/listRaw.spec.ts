import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Bitmex } from '../../../Bitmex'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { BITMEX_RAW_MARKETS } from '../../../test/fixtures/bitmexMarket'



describe(__filename, () => {

  it('should list Bitmex raw markets just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    publicRequest.returns(Promise.resolve(BITMEX_RAW_MARKETS))


    // executing
    const exchange = new Bitmex({})

    const {
      rawMarkets,
      requestWeight,
    } = await exchange.market.listRaw()


    // validating
    expect(rawMarkets).to.deep.eq(BITMEX_RAW_MARKETS)

    expect(requestWeight).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getBitmexEndpoints(exchange.settings).market.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
