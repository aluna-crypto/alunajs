import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockMarketParse } from '../../../../../../test/mocks/exchange/modules/market/mockMarketParse'
import { Sample } from '../../../Sample'
import { SAMPLE_RAW_MARKETS } from '../../../test/fixtures/sampleMarket'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Sample raw markets just fine', async () => {

    // preparing data
    const rawMarkets = SAMPLE_RAW_MARKETS

    // mocking
    const { parse } = mockMarketParse({ module: parseMod })

    each(PARSED_MARKETS, (market, index) => {
      parse.onCall(index).returns({ market })
    })


    // executing
    const exchange = new Sample({ settings: {} })

    const { markets } = exchange.market.parseMany({
      rawMarkets,
    })


    // validating
    expect(parse.callCount).to.be.eq(PARSED_MARKETS.length)
    expect(markets).to.deep.eq(PARSED_MARKETS)

  })

})
