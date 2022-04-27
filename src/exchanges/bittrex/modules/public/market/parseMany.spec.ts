import { expect } from 'chai'

import {
  BITTREX_PARSED_MARKETS,
  BITTREX_RAW_MARKET_SUMMARIES,
  BITTREX_RAW_MARKET_TICKERS,
  BITTREX_RAW_MARKETS_INFO,
} from '../../../test/fixtures/bittrexMarket'
import { mockBittrexParse } from './parse.mock'
import { parseMany } from './parseMany'



describe(__filename, () => {

  it('should parse many Bittrex raw markets just fine', async () => {

    const { parse } = mockBittrexParse()

    const parsed1 = BITTREX_PARSED_MARKETS[0]
    const parsed2 = BITTREX_PARSED_MARKETS[1]

    parse.onCall(0).returns({ market: parsed1 })
    parse.onCall(1).returns({ market: parsed2 })

    const marketsInfo = BITTREX_RAW_MARKETS_INFO
    const summaries = BITTREX_RAW_MARKET_SUMMARIES
    const tickers = BITTREX_RAW_MARKET_TICKERS

    const { markets } = parseMany({
      rawMarkets: {
        marketsInfo,
        summaries,
        tickers,
      },
    })

    expect(markets).to.deep.eq([
      parsed1,
      parsed2,
    ])

    expect(parse.callCount).to.be.eq(2)

  })

})
