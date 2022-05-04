import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Sample } from '../../../Sample'
import { SampleHttp } from '../../../SampleHttp'
import { sampleEndpoints } from '../../../sampleSpecs'
import { SAMPLE_RAW_MARKETS } from '../../../test/fixtures/sampleMarket'



describe(__filename, () => {

  it('should list Sample raw markets just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: SampleHttp.prototype })

    publicRequest.returns(Promise.resolve(SAMPLE_RAW_MARKETS))


    // executing
    const exchange = new Sample({ settings: {} })

    const {
      rawMarkets,
      requestCount,
    } = await exchange.market.listRaw()


    // validating
    expect(rawMarkets).to.deep.eq(SAMPLE_RAW_MARKETS)

    expect(requestCount).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: sampleEndpoints.market.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})