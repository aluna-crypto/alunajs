import { expect } from 'chai'
import { each } from 'lodash'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Sample } from '../../../Sample'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'
import {
  SAMPLE_RAW_MARKET_SUMMARIES,
  SAMPLE_RAW_MARKET_TICKERS,
  SAMPLE_RAW_MARKETS_INFO,
} from '../../../test/fixtures/sampleMarket'



describe(__filename, () => {

  it('should list Sample raw markets just fine', async () => {

    // preparing data
    const marketsInfo = SAMPLE_RAW_MARKETS_INFO
    const summaries = SAMPLE_RAW_MARKET_SUMMARIES
    const tickers = SAMPLE_RAW_MARKET_TICKERS


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: SampleHttp.prototype })

    each([marketsInfo, summaries, tickers], (returns, index) => {
      publicRequest.onCall(index).returns(Promise.resolve(returns))
    })


    // executing
    const exchange = new Sample({ settings: {} })

    const {
      rawMarkets,
      requestCount,
    } = await exchange.market.listRaw()


    // validating
    expect(rawMarkets).to.deep.eq({
      marketsInfo,
      summaries,
      tickers,
    })

    expect(requestCount).to.be.ok

    expect(publicRequest.callCount).to.be.eq(3)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: `${SAMPLE_PRODUCTION_URL}/markets`,
    })

    expect(publicRequest.secondCall.args[0]).to.deep.eq({
      url: `${SAMPLE_PRODUCTION_URL}/markets/summaries`,
    })

    expect(publicRequest.thirdCall.args[0]).to.deep.eq({
      url: `${SAMPLE_PRODUCTION_URL}/markets/tickers`,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
