import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Bitfinex } from '../../../Bitfinex'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { BITFINEX_RAW_MARKETS } from '../../../test/fixtures/bitfinexMarket'



describe(__filename, () => {

  it('should list Bitfinex raw markets just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    publicRequest.returns(Promise.resolve(BITFINEX_RAW_MARKETS))


    // executing
    const exchange = new Bitfinex({})

    const {
      rawMarkets,
      requestCount,
    } = await exchange.market.listRaw()


    // validating
    expect(rawMarkets).to.deep.eq(BITFINEX_RAW_MARKETS)

    expect(requestCount).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: bitfinexEndpoints.market.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
