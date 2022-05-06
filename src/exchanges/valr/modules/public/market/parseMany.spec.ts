import { expect } from 'chai'
import {
  each, filter, find, map,
} from 'lodash'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Valr } from '../../../Valr'
import { VALR_RAW_CURRENCY_PAIRS, VALR_RAW_MARKETS } from '../../../test/fixtures/valrMarket'
import * as parseMod from './parse'
import { IValrMarketsSchema } from '../../../schemas/IValrMarketSchema'



describe(__filename, () => {

  it('should parse many Valr raw markets just fine', async () => {

    // preparing data
    const rawMarkets: IValrMarketsSchema = {
      summaries: VALR_RAW_MARKETS,
      pairs: VALR_RAW_CURRENCY_PAIRS,
    }

    const onlineMarkets = filter(VALR_RAW_CURRENCY_PAIRS, ({ active }) => {
      return !!active
    })

    const onlineParsedMarkets = filter(PARSED_MARKETS, (market) => {
      return !!find(onlineMarkets, { symbol: market.symbolPair })
    })

    const returnItems = map(onlineParsedMarkets, (market) => ({ market }))

    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(returnItems, (market, index) => {
      parse.onCall(index).returns(market)
    })


    // executing
    const exchange = new Valr({})

    const { markets } = exchange.market.parseMany({
      rawMarkets,
    })


    // validating
    expect(parse.callCount).to.be.eq(onlineParsedMarkets.length)
    expect(markets).to.deep.eq(onlineParsedMarkets)

  })

})
