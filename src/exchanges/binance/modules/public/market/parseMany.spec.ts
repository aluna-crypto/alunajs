import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { binance } from '../../../binance'
import { BINANCE_RAW_MARKETS } from '../../../test/fixtures/binanceMarket'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many binance raw markets just fine', async () => {

    // preparing data
    const rawMarkets = BINANCE_RAW_MARKETS

    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_MARKETS, (market, index) => {
      parse.onCall(index).returns({ market })
    })


    // executing
    const exchange = new binance({})

    const { markets } = exchange.market.parseMany({
      rawMarkets,
    })


    // validating
    expect(parse.callCount).to.be.eq(PARSED_MARKETS.length)
    expect(markets).to.deep.eq(PARSED_MARKETS)

  })

})
