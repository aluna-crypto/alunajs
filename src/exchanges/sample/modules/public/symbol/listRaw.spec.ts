import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Sample } from '../../../Sample'
import { SampleHttp } from '../../../SampleHttp'
import { sampleEndpoints } from '../../../sampleSpecs'
import { SAMPLE_RAW_SYMBOLS } from '../../../test/fixtures/sampleSymbols'



describe(__filename, () => {

  it('should list Sample raw symbols just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: SampleHttp.prototype })

    publicRequest.returns(Promise.resolve(SAMPLE_RAW_SYMBOLS))


    // executing
    const exchange = new Sample({ settings: {} })

    const {
      rawSymbols,
      requestCount,
    } = await exchange.symbol.listRaw()


    // validating
    expect(rawSymbols).to.deep.eq(SAMPLE_RAW_SYMBOLS)

    expect(requestCount).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: sampleEndpoints.symbol.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
