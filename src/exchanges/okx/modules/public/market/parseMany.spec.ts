import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Okx } from '../../../Okx'
import { OKX_RAW_MARKETS } from '../../../test/fixtures/okxMarket'
import { OKX_RAW_SYMBOLS } from '../../../test/fixtures/okxSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Okx raw markets just fine', async () => {

    // preparing data
    const rawMarkets = OKX_RAW_MARKETS

    const rawSymbols = OKX_RAW_SYMBOLS

    const rawMarketsRequest = {
      rawMarkets,
      rawSymbols,
    }

    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_MARKETS, (market, index) => {
      parse.onCall(index).returns({ market })
    })


    // executing
    const exchange = new Okx({})

    const { markets } = exchange.market.parseMany({
      rawMarkets: rawMarketsRequest,
    })


    // validating
    expect(parse.callCount).to.be.eq(PARSED_MARKETS.length)
    expect(markets).to.deep.eq(PARSED_MARKETS)

  })

})
