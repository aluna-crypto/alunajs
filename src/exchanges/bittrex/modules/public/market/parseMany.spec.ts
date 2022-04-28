import { expect } from 'chai'
import {
  filter,
  find,
  map,
} from 'lodash'

import { mockMarketParse } from '../../../../../../test/helpers/exchange/modules/market/parse'
import { Bittrex } from '../../../Bittrex'
import { BittrexMarketStatusEnum } from '../../../enums/BittrexMarketStatusEnum'
import {
  BITTREX_PARSED_MARKETS,
  BITTREX_RAW_MARKET_SUMMARIES,
  BITTREX_RAW_MARKET_TICKERS,
  BITTREX_RAW_MARKETS_INFO,
} from '../../../test/fixtures/bittrexMarket'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Bittrex raw markets just fine', async () => {

    const onlineMarkets = filter(BITTREX_RAW_MARKETS_INFO, ({ status }) => {

      return status === BittrexMarketStatusEnum.ONLINE

    })

    const onlineParsedMarkets = filter(BITTREX_PARSED_MARKETS, (market) => {

      return !!find(onlineMarkets, { symbol: market.symbolPair })

    })

    const { parse } = mockMarketParse({
      module: parseMod,
      returns: map(onlineParsedMarkets, (market) => ({ market })),
    })

    const marketsInfo = BITTREX_RAW_MARKETS_INFO
    const summaries = BITTREX_RAW_MARKET_SUMMARIES
    const tickers = BITTREX_RAW_MARKET_TICKERS

    const exchange = new Bittrex({ settings: {} })

    const { markets } = exchange.market.parseMany({
      rawMarkets: {
        marketsInfo,
        summaries,
        tickers,
      },
    })

    expect(markets).to.deep.eq(onlineParsedMarkets)

    expect(parse.callCount).to.be.eq(2)

  })

})
