import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Poloniex } from '../../../Poloniex'
import { POLONIEX_RAW_MARKETS } from '../../../test/fixtures/poloniexMarket'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Poloniex raw markets just fine', async () => {

    // preparing data
    const rawMarkets = POLONIEX_RAW_MARKETS

    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_MARKETS, (market, index) => {
      parse.onCall(index).returns({ market })
    })


    // executing
    const exchange = new Poloniex({})

    const { markets } = exchange.market.parseMany({
      rawMarkets,
    })


    // validating
    expect(parse.callCount).to.be.eq(PARSED_MARKETS.length)
    expect(markets).to.deep.eq(PARSED_MARKETS)

  })

})
