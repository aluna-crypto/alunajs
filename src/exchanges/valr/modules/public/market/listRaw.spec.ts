import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Valr } from '../../../Valr'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'
import { VALR_RAW_MARKETS } from '../../../test/fixtures/valrMarket'



describe(__filename, () => {

  it('should list Valr raw markets just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })

    publicRequest.returns(Promise.resolve(VALR_RAW_MARKETS))


    // executing
    const exchange = new Valr({})

    const {
      rawMarkets,
      requestCount,
    } = await exchange.market.listRaw()


    // validating
    expect(rawMarkets).to.deep.eq(VALR_RAW_MARKETS)

    expect(requestCount).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: valrEndpoints.market.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
