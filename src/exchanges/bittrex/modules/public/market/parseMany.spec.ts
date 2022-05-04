import { expect } from 'chai'
import {
  each,
  filter,
  find,
  map,
} from 'lodash'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Bittrex } from '../../../Bittrex'
import { BittrexMarketStatusEnum } from '../../../enums/BittrexMarketStatusEnum'
import {
  BITTREX_RAW_MARKET_SUMMARIES,
  BITTREX_RAW_MARKET_TICKERS,
  BITTREX_RAW_MARKETS_INFO,
} from '../../../test/fixtures/bittrexMarket'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Bittrex raw markets just fine', async () => {

    // preparing data
    const marketsInfo = BITTREX_RAW_MARKETS_INFO
    const summaries = BITTREX_RAW_MARKET_SUMMARIES
    const tickers = BITTREX_RAW_MARKET_TICKERS

    const onlineMarkets = filter(marketsInfo, ({ status }) => {
      return status === BittrexMarketStatusEnum.ONLINE
    })

    const onlineParsedMarkets = filter(PARSED_MARKETS, (market) => {
      return !!find(onlineMarkets, { symbol: market.symbolPair })
    })


    // mocking
    const { parse } = mockParse({ module: parseMod })

    const returnItems = map(onlineParsedMarkets, (market) => ({ market }))

    each(returnItems, (returnItem, index) => {
      parse.onCall(index).returns(returnItem)
    })


    // executing
    const exchange = new Bittrex({})

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
