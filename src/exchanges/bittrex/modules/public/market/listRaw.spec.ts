import { expect } from 'chai'
import { each } from 'lodash'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Bittrex } from '../../../Bittrex'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import {
  BITTREX_RAW_MARKET_SUMMARIES,
  BITTREX_RAW_MARKET_TICKERS,
  BITTREX_RAW_MARKETS_INFO,
} from '../../../test/fixtures/bittrexMarket'



describe(__filename, () => {

  it('should list Bittrex raw markets just fine', async () => {

    const marketsInfo = BITTREX_RAW_MARKETS_INFO
    const summaries = BITTREX_RAW_MARKET_SUMMARIES
    const tickers = BITTREX_RAW_MARKET_TICKERS

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    each([marketsInfo, summaries, tickers], (returns, index) => {
      publicRequest.onCall(index).returns(Promise.resolve(returns))
    })

    const exchange = new Bittrex({ settings: {} })

    const {
      rawMarkets,
      requestCount,
    } = await exchange.market.listRaw()

    expect(rawMarkets).to.deep.eq({
      marketsInfo,
      summaries,
      tickers,
    })

    expect(requestCount).to.be.ok

    expect(publicRequest.callCount).to.be.eq(3)
    expect(publicRequest.args[0][0]).to.deep.eq({
      url: `${BITTREX_PRODUCTION_URL}/markets`,
    })
    expect(publicRequest.args[1][0]).to.deep.eq({
      url: `${BITTREX_PRODUCTION_URL}/markets/summaries`,
    })
    expect(publicRequest.args[2][0]).to.deep.eq({
      url: `${BITTREX_PRODUCTION_URL}/markets/tickers`,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
