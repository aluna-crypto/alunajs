import { expect } from 'chai'
import {
  each,
  filter,
  find,
  map,
} from 'lodash'

import { mockMarketParse } from '../../../../../../test/mocks/exchange/modules/market/mockMarketParse'
import { Sample } from '../../../Sample'
import { SampleMarketStatusEnum } from '../../../enums/SampleMarketStatusEnum'
import {
  SAMPLE_PARSED_MARKETS,
  SAMPLE_RAW_MARKET_SUMMARIES,
  SAMPLE_RAW_MARKET_TICKERS,
  SAMPLE_RAW_MARKETS_INFO,
} from '../../../test/fixtures/sampleMarket'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Sample raw markets just fine', async () => {

    // preparing data
    const marketsInfo = SAMPLE_RAW_MARKETS_INFO
    const summaries = SAMPLE_RAW_MARKET_SUMMARIES
    const tickers = SAMPLE_RAW_MARKET_TICKERS

    const onlineMarkets = filter(marketsInfo, ({ status }) => {
      return status === SampleMarketStatusEnum.ONLINE
    })

    const onlineParsedMarkets = filter(SAMPLE_PARSED_MARKETS, (market) => {
      return !!find(onlineMarkets, { symbol: market.symbolPair })
    })


    // mocking
    const { parse } = mockMarketParse({ module: parseMod })

    const returnItems = map(onlineParsedMarkets, (market) => ({ market }))

    each(returnItems, (returnItem, index) => {
      parse.onCall(index).returns(returnItem)
    })


    // executing
    const exchange = new Sample({ settings: {} })

    const { markets } = exchange.market.parseMany({
      rawMarkets: {
        marketsInfo,
        summaries,
        tickers,
      },
    })


    // validating
    expect(parse.callCount).to.be.eq(2)
    expect(markets).to.deep.eq(onlineParsedMarkets)

  })

})
