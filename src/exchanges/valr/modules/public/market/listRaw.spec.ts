import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import {
  VALR_RAW_CURRENCY_PAIRS,
  VALR_RAW_MARKETS,
} from '../../../test/fixtures/valrMarket'
import { Valr } from '../../../Valr'
import { ValrHttp } from '../../../ValrHttp'
import { getValrEndpoints } from '../../../valrSpecs'



describe(__filename, () => {

  it('should list Valr raw markets just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })

    publicRequest.onFirstCall().returns(Promise.resolve(VALR_RAW_MARKETS))
    publicRequest.onSecondCall().returns(Promise.resolve(VALR_RAW_CURRENCY_PAIRS))


    // executing
    const exchange = new Valr({})

    const {
      rawMarkets,
      requestCount,
    } = await exchange.market.listRaw()


    // validating
    expect(rawMarkets).to.deep.eq({
      summaries: VALR_RAW_MARKETS,
      pairs: VALR_RAW_CURRENCY_PAIRS,
    })

    expect(requestCount).to.be.ok

    expect(publicRequest.callCount).to.be.eq(2)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getValrEndpoints(exchange.settings).market.summaries,
    })

    expect(publicRequest.secondCall.args[0]).to.deep.eq({
      url: getValrEndpoints(exchange.settings).market.pairs,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
