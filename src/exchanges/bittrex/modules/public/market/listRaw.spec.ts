import { expect } from 'chai'

import { Bittrex } from '../../../Bittrex'
import { mockBittrexHttp } from '../../../BittrexHttp.mock'
import {
  BITTREX_RAW_MARKET_SUMMARIES,
  BITTREX_RAW_MARKET_TICKERS,
  BITTREX_RAW_MARKETS_INFO,
} from '../../../test/fixtures/bittrexMarket'



describe(__filename, () => {

  it('should list Bittrex raw markets just fine', async () => {

    const {
      publicRequest,
    } = mockBittrexHttp()

    const marketsInfo = BITTREX_RAW_MARKETS_INFO
    const summaries = BITTREX_RAW_MARKET_SUMMARIES
    const tickers = BITTREX_RAW_MARKET_TICKERS

    publicRequest.onCall(0).returns(Promise.resolve(marketsInfo))
    publicRequest.onCall(1).returns(Promise.resolve(summaries))
    publicRequest.onCall(2).returns(Promise.resolve(tickers))

    const exchange = new Bittrex({ settings: {} })

    const { rawMarkets } = await exchange.market.listRaw()

    expect(rawMarkets).to.deep.eq({
      marketsInfo,
      summaries,
      tickers,
    })

    expect(publicRequest.callCount).to.be.eq(3)

  })

})
