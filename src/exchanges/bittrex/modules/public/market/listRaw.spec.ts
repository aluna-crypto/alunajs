import { expect } from 'chai'
import { each } from 'lodash'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Bittrex } from '../../../Bittrex'
import { BittrexHttp } from '../../../BittrexHttp'
import { bittrexEndpoints } from '../../../bittrexSpecs'
import {
  BITTREX_RAW_MARKET_SUMMARIES,
  BITTREX_RAW_MARKET_TICKERS,
  BITTREX_RAW_MARKETS_INFO,
} from '../../../test/fixtures/bittrexMarket'



describe(__filename, () => {

  it('should list Bittrex raw markets just fine', async () => {

    // preparing data
    const marketsInfo = BITTREX_RAW_MARKETS_INFO
    const summaries = BITTREX_RAW_MARKET_SUMMARIES
    const tickers = BITTREX_RAW_MARKET_TICKERS


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    each([marketsInfo, summaries, tickers], (returns, index) => {
      publicRequest.onCall(index).returns(Promise.resolve(returns))
    })


    // executing
    const exchange = new Bittrex({})

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
      url: bittrexEndpoints.market.markets,
    })

    expect(publicRequest.secondCall.args[0]).to.deep.eq({
      url: bittrexEndpoints.market.summaries,
    })

    expect(publicRequest.thirdCall.args[0]).to.deep.eq({
      url: bittrexEndpoints.market.tickers,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
